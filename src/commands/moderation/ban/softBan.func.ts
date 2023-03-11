import { confirm } from '../../../components/messageEmbed/';
import ConfirmButtons, { ConfirmComponentAnswerOptionsParams } from "../../../components/WaiterEvent/ConfirmButtons";

import type { CommandInteraction, GuildMember, Message, User } from "discord.js";
import type { Locale } from "../../../locale";
import type { BotDefinitions } from "../../index.types";

type SoftBanOptions = {
    interaction?: CommandInteraction;
    message?: Message<boolean>;
    locale: Locale;
    bot: BotDefinitions;
    onError: (message: string) => void;
    onFinish: (params: { banned: boolean }) => void;
}

const softBan = async (
    bannedMember: GuildMember,
    author: User,
    options: SoftBanOptions
) => {
    if (!options.message && !options.interaction)
        throw new Error('Please add to this func a message or interaction param');
    if (!bannedMember)
        return options.onError(options.locale.interaction.member.notFound);
    if (!bannedMember.bannable)
        return options.onError(options.locale.command.ban.interaction.isNotBannable);

    const props = {
        embeds: [
            confirm.softBanMember({
                member: bannedMember,
                locale: options.locale,
                authorTag: author.tag,
                authorUrl: author.avatarURL() ?? '',
                botColor: options.bot.hexColor
            })
        ]
    }

    await new ConfirmButtons({
        locale: options.locale, user: author,
        buttonId: `${bannedMember.user.username}#${bannedMember.user.discriminator}`
    })
        .setMessage({
            message: options.message,
            messageProps: props
        })
        .setInteraction({
            interaction: options.interaction,
            interactionProps: { ...props, ephemeral: true }
        })
        .onCollect({
            onAnswerYes: async (_options: ConfirmComponentAnswerOptionsParams) => {
                const reason = `${author.id}: ${author.username}#${author.discriminator} "${options.locale.labels.usedCommand.replaceAll('{command}', 'ban soft-ban')}"`;
                await bannedMember.ban({ reason, deleteMessageSeconds: 604800 }); // 7 days
                await bannedMember.guild.bans.remove(bannedMember.id, reason);
                if (_options.messageReply) {
                    await _options.messageReply.react('🔨');
                    options.onFinish({ banned: true });
                    return;
                }
                if (options.interaction) {
                    await options.interaction.editReply({ ...props, content: '🔨' });
                    options.onFinish({ banned: true });
                    return;
                }
            },
            onAnswerNo: async (_options: ConfirmComponentAnswerOptionsParams) => {
                if (_options.messageReply) {
                    await _options.messageReply.delete();
                    options.onFinish({ banned: false });
                    return;
                }
                if (options.interaction) {
                    await options.interaction.deleteReply();
                    options.onFinish({ banned: false });
                    return;
                }
            },
        });
}

export default softBan;