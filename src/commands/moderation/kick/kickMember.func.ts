import { CommandInteraction, GuildMember, Message } from "discord.js";
import { confirmButtons } from "../../../components/messageActionRow";
import { confirm, PM } from "../../../components/messageEmbed";
import { onlyMessageAuthorCanUse } from "../../../utils/collectorFilters";
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
}

const kickMember = async ({ interaction, message, kickedMember, reason, options, ephemeral }: RequireAtLeastOne<KickMemberOptions, 'interaction' | 'message'>) => {
    if (!kickedMember) return { content: options.locale.interaction.member.notFound, ephemeral };
    if (!kickedMember.kickable) return { content: options.locale.interaction.member.isNotKickable, ephemeral };

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

    collector.on('end', async memberInteraction => {
        try {
            const componentId = memberInteraction.first()?.customId;
            if (componentId === component.button.yesId) {
                await kickedMember.kick(reason || '');
                await memberInteraction.first()?.reply(options.locale.interaction.member.kickFromServer);
                kickedMember.send({
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

                const editMessage = { content: '🦶💢', components: [], ephemeral };
                if (interactionMessage) await interactionMessage.edit(editMessage);
                if (interaction) await interaction.editReply(editMessage);
            }
            if (componentId === component.button.noId) {
                const editMessage = { content: `🎈 ${options.locale.interaction.member.kickCanceled}`, embeds: [], components: [] };
                if (interactionMessage) await interactionMessage.edit(editMessage);
                if (interaction) await interaction.editReply(editMessage);
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