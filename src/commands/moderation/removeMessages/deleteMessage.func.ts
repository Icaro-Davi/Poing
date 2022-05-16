import { NewsChannel, PartialDMChannel, TextChannel, ThreadChannel } from "discord.js";
import { Locale } from "../../../locale";
import { ExecuteCommandReturn } from "../../index.types";

type options = {
    channel: PartialDMChannel | NewsChannel | TextChannel | ThreadChannel;
    quantity: number;
    locale: Locale;
    ephemeral?: boolean;
}

const deleteMessages = async ({ channel, locale, quantity, ephemeral }: options): ExecuteCommandReturn => {
    if (channel.type === 'DM') return;
    const deletedMessages = await channel.bulkDelete(quantity, true);
    return {
        content: locale.command.removeMessages.interaction.deletedMessages,
        ephemeral,
        vars: {
            deletedMessageSize: deletedMessages.size.toString()
        }
    };
}

export default deleteMessages;