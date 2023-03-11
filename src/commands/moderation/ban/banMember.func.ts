import { CommandInteraction, GuildMember, Message, User } from "discord.js";
import { confirmButtons } from "../../../components/messageActionRow";
import { confirm, PM } from "../../../components/messageEmbed";
import { Locale } from "../../../locale";
import { onlyMessageAuthorCanUse } from "../../../components/collectorFilters";
import handleError from "../../../utils/handleError";
import { RequireAtLeastOne } from "../../../utils/typescript.funcs";
import { BotDefinitions, ExecuteCommandReturn } from "../../index.types";

type BanMemberOptions = {
    locale: Locale;
    days?: number | null;
    reason?: string | null;
    bot: BotDefinitions;
    banMember?: GuildMember;
    ephemeral?: boolean;
    onError: (error: string) => void;
    onFinish: (params: { banned: boolean }) => void;
}

type BanMemberArgs = {
    message: Message;
    interaction: CommandInteraction;
    options: BanMemberOptions;
}

const banMember = async ({ message, interaction, options }: RequireAtLeastOne<BanMemberArgs, 'message' | 'interaction'>) => {
    if (!message && !interaction)
        throw new Error('Please add to this func a message or interaction param');
    if (!options.banMember)
        return options.onError(options.locale.interaction.member.notFound);
    if (!options.banMember.bannable)
        return options.onError(options.locale.command.ban.interaction.isNotBannable);

    const action = (message ? message : interaction);
    const guild = message?.guild || interaction?.guild;
    const author = (message?.author || interaction?.member?.user) as User;

    const component = confirmButtons({ locale: options.locale });

    const interactionMessage = await action!.reply({
        embeds: [confirm.banMember({
            locale: options.locale, botColor: options.bot.hexColor,
            authorTag: author.tag, authorUrl: author.avatarURL() || '',
            days: Number(options.days),
            reason: options.reason ?? '',
            member: options.banMember,
        })],
        components: [component.row],
        ...options.ephemeral ? { ephemeral: true } : {},
    });

    const collector = onlyMessageAuthorCanUse((message! ?? interaction!), { ...options, author: author });

    collector.on('end', async (buttonInteraction) => {
        try {
            let buttonId = buttonInteraction.first()?.customId;
            if (buttonId === component.button.yesId) {
                let promises = [];
                promises.push(options.banMember!.ban({
                    ...options.days ? { deleteMessageSeconds: 60 * 60 * 24 * Number(options.days) } : {},
                    reason: options.reason ?? options.locale.command.ban.interaction.bannedWithNoReason
                }));
                await Promise.all(promises);
                options.banMember!.send({
                    embeds: [PM.toBanishedMember({
                        botColor: options.bot.hexColor, locale: options.locale,
                        guildName: guild?.name || '', iconUrl: guild?.iconURL() || '',
                        reason: options.reason || 'No Reason'
                    })],
                }).catch((error) => {
                    handleError(error, {
                        errorLocale: '/command/moderation/ban',
                        locale: options.locale,
                        message: message!,
                        interaction: interaction!,
                        customMessage: error.code === '50007' ? options.locale.command.ban.error[50007] : ''
                    });
                });
                message && await interactionMessage!.edit({ content: `🔨 ${options.locale.command.ban.interaction.banishedFromServer}`, embeds: [], components: [] });
                interaction && await interaction.editReply({ content: `🔨 ${options.locale.command.ban.interaction.banishedFromServer}`, embeds: [], components: [] });
                options.onFinish({ banned: true });
            }
            if (buttonId === component.button.noId) {
                const cancelled = { content: `🎈 ${options.locale.command.ban.interaction.banishedCanceled}`, embeds: [], components: [] };
                message && await interactionMessage!.edit(cancelled);
                interaction && await interaction.editReply(cancelled);
                options.onFinish({ banned: false });
            }
            return;
        } catch (error: any) {
            handleError(error, {
                errorLocale: '/command/moderation/ban',
                locale: options.locale,
                message: message!,
                interaction: interaction!
            });
        }
    });
}

export default banMember;