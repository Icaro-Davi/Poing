import { CommandInteraction, GuildMember, Message, PermissionResolvable, User } from "discord.js";
import { Locale } from "../locale";

const onlyMessageAuthorCanUse = (message: Message | CommandInteraction, options: { locale: Locale, author: GuildMember | User, ephemeral?: boolean }) => {
    return message.channel!.createMessageComponentCollector({
        filter: async (interaction) => {
            try {
                if (interaction.user.id === options.author.id) return true;
                await interaction.reply({ ephemeral: options.ephemeral, content: options.locale.interaction.youCantUseThisButton });
                return false;
            } catch (error: any) {
                console.error(`[COLLECTOR_ONLY_MESSAGE_AUTHOR_CAN_USE] error on src.components.collectorFilters.onlyMessageAuthorCanUse (Discord error code ${error?.code} http status ${error.httpStatus})`);
                return false;
            }
        },
        max: 3,
        time: 1000 * 60,
        dispose: true
    });
}

const onlyWithPermission = (message: Message | CommandInteraction, options: { locale: Locale, permissions: PermissionResolvable, ephemeral?: boolean }) => {
    return message.channel!.createMessageComponentCollector({
        filter: async (interaction) => {
            if (interaction.memberPermissions.has(options.permissions)) {
                return true;
            } else {
                await interaction.reply({ ephemeral: options.ephemeral, content: options.locale.interaction.youCantUseThisButton });
                return false;
            }
        },
        max: 3,
        time: 1000 * 60,
        dispose: true,
    });
}

export {
    onlyMessageAuthorCanUse,
    onlyWithPermission
}