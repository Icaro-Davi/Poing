import { Message, PermissionResolvable } from "discord.js";
import { Locale } from "../locale";

const onlyMessageAuthorCanUse = (message: Message, locale: Locale) => {
    return message.channel.createMessageComponentCollector({
        filter: async (interaction) => {
            if (interaction.user.id === message.author.id) return true;
            await interaction.reply({ ephemeral: true, content: locale.interaction.youCantUseThisButton });
            return false;
        },
        max: 1,
        time: 1000 * 60
    });
}

const onlyWithPermission = (message: Message, locale: Locale, permissions: PermissionResolvable) => {
    return message.channel.createMessageComponentCollector({
        filter: (interaction) => {
            if (interaction.memberPermissions.has(permissions)) {
                return true;
            } else {
                interaction.reply({ ephemeral: true, content: locale.interaction.youCantUseThisButton });
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