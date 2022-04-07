import { Message } from "discord.js";
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

export {
    onlyMessageAuthorCanUse
}