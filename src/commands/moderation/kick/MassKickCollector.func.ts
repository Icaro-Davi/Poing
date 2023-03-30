import { ChatInputCommandInteraction, Collection, CommandInteraction, GuildMember, Message, MessageComponentInteraction } from 'discord.js';
import Member from '../../../application/Member';
import VoteCollector from '../../../collectors/Vote';
import AnswerMember from '../../../utils/AnswerMember';
import CreateComponentId from '../../../utils/CreateComponentId';
import { ExecuteCommandOptions } from '../../index.types';
import BulkKickMembers from './BulkKickMember.func';
import { createKickMassInteractionComponent, KickMassVote } from './kick.components';

const createId = (componentId: string, uniqueId: string) => CreateComponentId('mass-kick', `${componentId}-${uniqueId}`);
const collectorTime = 1000 * 60 * 5;

export type UserInputInteractionData = { kickedMembers: Collection<string, GuildMember>; isVoteActive: boolean; };

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
    const componentRef = {
        cancelId: createId('cancel', uniqueId),
        voteModeOnId: createId('vote-on', uniqueId),
        voteModeOffId: createId('vote-off', uniqueId),
        selectMembersId: createId('select-members', uniqueId),
        submitId: createId('submit', uniqueId),
    }
    let userInputInteractionData: UserInputInteractionData = {
        kickedMembers: new Collection(),
        isVoteActive: false
    }

    const answerMemberDefaultOptions = {
        interaction: params.interaction,
        message: params.message,
        options: { editReply: true },
    }
    const defaultComponentOptions = {
        locale: params.options.locale, uniqueId,
        collectorTime, componentRef, embedColor
    }

    const replyResult = await AnswerMember({
        ...answerMemberDefaultOptions,
        content: createKickMassInteractionComponent({ ...defaultComponentOptions, userInputInteractionData })
    });

    if (params.message && replyResult) answerMemberDefaultOptions.message = replyResult;

    const cancelCollector = async function (isFinished?: boolean) {
        try {
            const cancelMessageInteraction = {
                components: [], embeds: [],
                ephemeral: false,
                content: `Kick mass ${typeof isFinished === 'boolean' ? (isFinished ? params.options.locale.labels.finished : params.options.locale.labels.canceled) : params.options.locale.labels.expired}`
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

    return new Promise<UserInputInteractionData | undefined>((resolve, reject) => {
        collector?.on('collect', async (msg) => {
            try {
                if (!msg.customId.includes(uniqueId)) return;
                switch (msg.customId) {
                    case componentRef.cancelId:
                        clearTimeout(collectorContext.cancelRef!);
                        await cancelCollector(false);
                        resolve(undefined);
                        break;

                    case componentRef.voteModeOffId:
                        userInputInteractionData.isVoteActive = false;
                        await AnswerMember({
                            ...answerMemberDefaultOptions,
                            content: createKickMassInteractionComponent({ ...defaultComponentOptions, userInputInteractionData }),
                        });
                        msg.deferUpdate();
                        break;

                    case componentRef.voteModeOnId:
                        userInputInteractionData.isVoteActive = true;
                        await AnswerMember({
                            ...answerMemberDefaultOptions,
                            content: createKickMassInteractionComponent({ ...defaultComponentOptions, userInputInteractionData }),
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
                                content: createKickMassInteractionComponent({ ...defaultComponentOptions, userInputInteractionData }),
                            });
                            msg.deferUpdate();
                        }
                        break;

                    case componentRef.submitId:
                        collectorContext.isSubmit = true;
                        clearTimeout(collectorContext.cancelRef!);
                        await cancelCollector(true);
                        await params.event.onFinish(userInputInteractionData);
                        resolve(userInputInteractionData);
                        break;
                }

                if (!collectorContext.isSubmit)
                    collectorContext.cancelRef = setCollectorExpiration(collectorContext.cancelRef);
            } catch (error) {
                reject(error);
            }
        });
    });
}

export default CreateMassKickCollector;

export const executeMassKickWithVote = async (params: {
    options: ExecuteCommandOptions;
    message?: Message;
    interaction?: ChatInputCommandInteraction;
}) => {
    const { options, interaction, message } = params;
    if (!interaction && !message) throw new Error('Needs interaction or message!');

    const author = (params.message?.member?.user ?? params.interaction?.user)!;
    return await CreateMassKickCollector({
        options, interaction, message,
        event: {
            async onFinish(userInput) {
                await new Promise(async (resolve, reject) => {
                    const kickMembers = async () =>
                        await BulkKickMembers([...userInput.kickedMembers.values()], `${author.username}#${author.discriminator} ${params.options.locale.labels.used} [kick mass]`).catch(reject);
                    if (userInput.isVoteActive) {
                        new VoteCollector({ interaction, message, vote: { endsInMilliseconds: collectorTime } })
                            .applyMutableComponent(function (_userInput, componentRef) {
                                return {
                                    content: KickMassVote.voteInteraction({
                                        collectorTime, componentRef, userInput,
                                        embedColor: options.bot.hexColor,
                                        locale: options.locale,
                                        voteCount: { no: _userInput.vote.no.size, yes: _userInput.vote.yes.size },
                                    }),
                                };
                            })
                            .onError(reject)
                            .onFinish(async result => {
                                if (result.vote.yes.size > result.vote.no.size) {
                                    await kickMembers();
                                    resolve(true);
                                }
                                return {
                                    content: KickMassVote.result({
                                        locale: options.locale,
                                        embedColor: options.bot.hexColor,
                                        userInput, voteCount: { no: result.vote.no.size, yes: result.vote.yes.size }
                                    }),
                                }
                            });
                    } else {
                        await kickMembers();
                        resolve(true);
                    }
                });
            },
        }
    });
}