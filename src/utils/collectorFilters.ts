import { CommandInteraction, GuildMember, Message, PermissionResolvable, User } from "discord.js";
import { Locale } from "../locale";

const onlyMessageAuthorCanUse = (message: Message | CommandInteraction, options: { locale: Locale, author: GuildMember | User, ephemeral?: boolean }) => {
    return message.channel!.createMessageComponentCollector({
        filter: async (interaction) => {
            if (interaction.user.id === options.author.id) return true;
            await interaction.reply({ ephemeral: options.ephemeral, content: options.locale.interaction.youCantUseThisButton });
            return false;
        },
        max: 1,
        time: 1000 * 60
    });
}

const onlyWithPermission = (message: Message | CommandInteraction, options: { locale: Locale, permissions: PermissionResolvable, ephemeral?: boolean }) => {
    return message.channel!.createMessageComponentCollector({
        filter: (interaction) => {
            if (interaction.memberPermissions.has(options.permissions)) {
                return true;
            } else {
                interaction.reply({ ephemeral: options.ephemeral, content: options.locale.interaction.youCantUseThisButton });
                return false;
            }
        },
        idle: 1000 * 60,
        dispose: true
    });
}

export {
    onlyMessageAuthorCanUse,
    onlyWithPermission
}