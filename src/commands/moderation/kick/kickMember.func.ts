import { CommandInteraction, GuildMember, Message } from "discord.js";
import { onlyMessageAuthorCanUse } from "../../../components/collectorFilters";
import { confirmButtons } from "../../../components/messageActionRow";
import { confirm, PM } from "../../../components/messageEmbed";
import handleError from "../../../utils/handleError";
import { RequireAtLeastOne } from "../../../utils/typescript.funcs";
import { ExecuteCommandOptions } from "../../index.types";

type KickMemberOptions = {
    interaction: CommandInteraction;
    kickedMember: GuildMember;
    message: Message;
    reason?: string;
    options: ExecuteCommandOptions;
    ephemeral?: boolean;
    onError: (message: string) => void;
    onFinish: (params: { kicked: boolean }) => void;
}

const kickMember = async ({ interaction, message, kickedMember, reason, options, ephemeral, onError, onFinish }: RequireAtLeastOne<KickMemberOptions, 'interaction' | 'message'>) => {
    if (!interaction && !message) throw new Error('Needs interaction or message');
    if (!kickedMember) return onError(options.locale.interaction.member.notFound);
    if (!kickedMember.kickable) return onError(options.locale.interaction.member.isNotKickable);

    const author = (message?.author ?? interaction?.user)!;
    const guild = (message?.guild || interaction?.guild)!;
    const component = confirmButtons({ locale: options.locale });

    const interactionMessage = await (interaction || message)!.reply({
        embeds: [confirm.kickMember({
            botColor: options.bot.hexColor,
            locale: options.locale, authorTag: author.tag, authorUrl: author.avatarURL() || '',
            member: kickedMember, reason
        })],
        components: [component.row],
        ephemeral
    });

    const collector = onlyMessageAuthorCanUse((message || interaction)!, { author, locale: options.locale, ephemeral });

    collector.on('collect', async memberInteraction => {
        try {
            const componentId = memberInteraction.customId;
            if (componentId === component.button.yesId) {
                await kickedMember.send({
                    embeds: [PM.toKickedMember({
                        botColor: options.bot.hexColor, guildName: guild.name || '',
                        iconUrl: guild.iconURL() || '',
                        locale: options.locale,
                        reason
                    })]
                }).catch(error => message && handleError(error, {
                    errorLocale: '/commands/moderation/kick',
                    locale: options.locale,
                    message,
                    customMessage: error.code == '50007' ? options.locale.command.kick.error[50007] : ''
                }));
                await kickedMember.kick(reason || '');
                await memberInteraction.reply(options.locale.interaction.member.kickFromServer);

                const editMessage = { content: '🦶💢', components: [], embeds: [], ephemeral };
                if (interactionMessage) await interactionMessage.edit(editMessage);
                if (interaction) await interaction.editReply(editMessage);
                collector.stop();
                await onFinish({ kicked: true });
            }
            if (componentId === component.button.noId) {
                const editMessage = { content: `🎈 ${options.locale.interaction.member.kickCanceled}`, embeds: [], components: [] };
                if (interactionMessage) await interactionMessage.edit(editMessage);
                if (interaction) await interaction.editReply(editMessage);
                collector.stop();
                await onFinish({ kicked: false });
            }
        } catch (error) {
            message && handleError(error, {
                locale: options.locale,
                errorLocale: '/commands/moderation/kick',
                message,
            });
        }
    });
}

export default kickMember;