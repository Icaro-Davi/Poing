import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection, CommandInteraction, EmbedBuilder, GuildMember, Message, MessageComponentInteraction, UserSelectMenuBuilder } from 'discord.js';
import Member from '../../../application/Member';
import { Locale } from '../../../locale';
import AnswerMember from '../../../utils/AnswerMember';
import CreateComponentId from '../../../utils/CreateComponentId';
import { replaceValuesInString } from '../../../utils/replaceValues';
import { ExecuteCommandOptions } from '../../index.types';

const createId = (componentId: string, uniqueId: string) => CreateComponentId('mass-kick', `${componentId}-${uniqueId}`);
const collectorTime = 1000 * 60 * 5;

type UserInputInteractionData = { kickedMembers: Collection<string, GuildMember>; isVoteActive: boolean; };

const createMessageWithComponents = function (params: {
    locale: Locale;
    uniqueId: string;
    embedColor: number;
    userInputInteractionData: UserInputInteractionData
}) {
    const ref = {
        cancelId: createId('cancel', params.uniqueId),
        voteModeOnId: createId('vote-on', params.uniqueId),
        voteModeOffId: createId('vote-off', params.uniqueId),
        selectMembersId: createId('select-members', params.uniqueId),
        submitId: createId('submit', params.uniqueId),
    }
    const message = {
        embeds: [
            new EmbedBuilder({
                title: 'Confirmação',
                color: params.embedColor,
                ...params.userInputInteractionData.kickedMembers.size > 0
                    ? { description: `Escolhidos:\n${params.userInputInteractionData.kickedMembers.filter(guildMember => guildMember.kickable).map(guildMember => `[<@${guildMember.id}>]`).join(' ')}` }
                    : {},
                fields: [
                    { name: 'Estado da Votação', value: params.userInputInteractionData.isVoteActive ? 'Ativa' : 'Desativada' }
                ]
            }),
            new EmbedBuilder({
                color: params.embedColor,
                title: 'Kick em massa',
                description: 'Selecione os membros que quer kickar, mas cuidado esse comando é muito poderoso, por conta disso usaremos apenas 10% de seu poder, se o membro não estiver na lista de escolhidos é porque não é kickavel por possuir privilégios.',
                fields: [
                    { name: '☠ Selecionar Membros', value: 'Você pode selecionar os membros que deseja kickar porém apenas 10 serão aceitos, se deseja remover algum basta selecionar novamente.', inline: true },
                    {
                        name: (!params.userInputInteractionData.isVoteActive)
                            ? '❗ Ativar Votação'
                            : '❕ Desativar Votação',
                        value: replaceValuesInString(`Ativa ou Desativa o modo votação, que os jogos comecem e as almas selecionadas sejam julgadas perante o olho do slime ceifador. {emoji}`, {
                            emoji: (!params.userInputInteractionData.isVoteActive) ? '😈' : '👿'
                        }), inline: true
                    },
                    { name: '❌ Cancelar', value: 'Vamos parar por aqui a brincadeira acabou por enquanto, foi so zoeira', inline: true }
                ],
                footer: { text: replaceValuesInString('Será cancelado em {time} minutos por inatividade', { time: collectorTime / (60 * 1000) }) }
            })
        ],
        components: [
            new ActionRowBuilder<UserSelectMenuBuilder>({
                components: [new UserSelectMenuBuilder({ placeholder: '☠ Selecionar Membros', customId: ref.selectMembersId, maxValues: 10 })]
            }),
            new ActionRowBuilder<ButtonBuilder>({
                components: [
                    ...(!params.userInputInteractionData.isVoteActive)
                        ? [new ButtonBuilder({ label: 'Ativar Votação', emoji: '❗', style: ButtonStyle.Primary, customId: ref.voteModeOnId })]
                        : [new ButtonBuilder({ label: 'Desativar Votação', emoji: '❕', style: ButtonStyle.Secondary, customId: ref.voteModeOffId })],
                    new ButtonBuilder({ label: 'Finalizar', emoji: '✅', style: ButtonStyle.Success, customId: ref.submitId, disabled: params.userInputInteractionData.kickedMembers.size < 1  }),
                    new ButtonBuilder({ label: '❌ Cancelar', style: ButtonStyle.Danger, customId: ref.cancelId })
                ]
            }),
        ]
    }
    return { message, ref };
}

const CreateMassKickCollector = async function (params: {
    message?: Message;
    interaction?: CommandInteraction;
    options: ExecuteCommandOptions;
    event: {
        onFinish: (userInput: UserInputInteractionData) => void | Promise<void>;
    }
}) {
    const user = (params.message?.member?.user ?? params.interaction?.member?.user)!;
    const guild = (params.message?.guild ?? params.interaction?.guild)!;
    const uniqueId = `${Math.random().toString(32).slice(4)}-${user.id}`;
    const embedColor = params.options.bot.hexColor;
    const collectorOptions = { filter: (msg: MessageComponentInteraction) => msg.user.id === user.id, time: collectorTime }
    const collector = params.message?.channel.createMessageComponentCollector(collectorOptions) ?? params.interaction?.channel?.createMessageComponentCollector(collectorOptions);
    let userInputInteractionData: UserInputInteractionData = {
        kickedMembers: new Collection(),
        isVoteActive: false
    }

    const answerMemberDefaultOptions = {
        interaction: params.interaction,
        message: params.message,
        options: { editReply: true },
    }
    const messageInteractionVoteOff = createMessageWithComponents({ locale: params.options.locale, uniqueId, embedColor, userInputInteractionData });
    const componentRef = messageInteractionVoteOff.ref ?? messageInteractionVoteOff.ref;
    const replyResult = await AnswerMember({ ...answerMemberDefaultOptions, content: messageInteractionVoteOff.message as any });

    const cancelCollector = async function (isFinished?: boolean) {
        try {
            const cancelMessageInteraction = {
                components: [], embeds: [],
                ephemeral: false,
                content: `Kick mass ${typeof isFinished === 'boolean' ? (isFinished ? 'finalizado' : 'cancelado') : 'expirado'}`
            }
            await AnswerMember({ ...answerMemberDefaultOptions, content: cancelMessageInteraction });
            collector?.stop();
        } catch (error) {
            console.error('src/commands/moderation/kick/MassKickCollector.func.ts', error);
        }
    }

    const setCollectorExpiration = function (ref?: NodeJS.Timeout) {
        ref && clearTimeout(ref);
        collector?.resetTimer({ time: collectorTime });
        if (replyResult) {
            return setTimeout(cancelCollector, collectorTime);
        }
    }

    let collectorContext = { cancelRef: setCollectorExpiration(), isSubmit: false }
    collector?.on('collect', async (msg) => {
        console.log(msg.customId);
        if (!msg.customId.includes(uniqueId)) return;
        switch (msg.customId) {
            case componentRef.cancelId:
                clearTimeout(collectorContext.cancelRef!);
                await cancelCollector();
                break;

            case componentRef.voteModeOffId:
                userInputInteractionData.isVoteActive = false;
                await AnswerMember({
                    ...answerMemberDefaultOptions,
                    content: createMessageWithComponents({ locale: params.options.locale, uniqueId, embedColor, userInputInteractionData }).message,
                });
                msg.deferUpdate();
                break;

            case componentRef.voteModeOnId:
                userInputInteractionData.isVoteActive = true;
                await AnswerMember({
                    ...answerMemberDefaultOptions,
                    content: createMessageWithComponents({ locale: params.options.locale, uniqueId, embedColor, userInputInteractionData }).message,
                });
                msg.deferUpdate();
                break;

            case componentRef.selectMembersId:
                if (msg.isUserSelectMenu()) {
                    if (msg.users.size < 1) {
                        msg.deferUpdate();
                        return;
                    }
                    const guildMembers = (await Promise.allSettled(msg.users.map(user => {
                        let guildMember = userInputInteractionData.kickedMembers.get(user.id);
                        if (guildMember) {
                            return guildMember;
                        } else {
                            return Member.find({ guild, member: user.id });
                        }
                    }))).reduce(
                        (prev, current) =>
                            (current.status === 'fulfilled' && current.value)
                                ? [...prev, current.value]
                                : prev,
                        [] as GuildMember[]
                    );

                    const membersCollection = new Collection<string, GuildMember>(
                        guildMembers.map(guildMember => [guildMember!.id, guildMember!])
                    );
                    userInputInteractionData.kickedMembers = membersCollection;
                    await AnswerMember({
                        ...answerMemberDefaultOptions,
                        content: createMessageWithComponents({ locale: params.options.locale, uniqueId, embedColor, userInputInteractionData }).message,
                    });
                    msg.deferUpdate();
                }
                break;

            case componentRef.submitId:
                collectorContext.isSubmit = true;
                clearTimeout(collectorContext.cancelRef!);
                await cancelCollector(true);
                await params.event.onFinish(userInputInteractionData);
                break;
        }

        if (!collectorContext.isSubmit)
            collectorContext.cancelRef = setCollectorExpiration(collectorContext.cancelRef);
    });
}

export default CreateMassKickCollector;