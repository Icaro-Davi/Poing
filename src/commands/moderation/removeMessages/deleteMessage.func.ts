import { CommandInteraction, Message, NewsChannel, PartialDMChannel, TextChannel, ThreadChannel } from "discord.js";
import { Locale } from "../../../locale";
import { replaceValuesInString } from "../../../utils/replaceValues";
import { ExecuteCommandReturn } from "../../index.types";

type options = {
    channel: PartialDMChannel | NewsChannel | TextChannel | ThreadChannel;
    quantity: number;
    locale: Locale;
    ephemeral?: boolean;
    message?: Message;
    interaction?: CommandInteraction;
}

const deleteMessages = async ({ channel, locale, quantity, ephemeral, message, interaction }: options): ExecuteCommandReturn => {
    if (channel.type === 'DM') return;
    if (message) quantity += 1;
    const deletedMessages = await channel.bulkDelete(quantity, true);
    const msg = {
        content: replaceValuesInString(locale.command.removeMessages.interaction.deletedMessages, {
            deletedMessageSize: (deletedMessages.size - (message ? 1 : 0)).toString()
        }),
        ephemeral
    }
    if (message) await message.channel.send(msg);
    if (interaction) await interaction.reply(msg);
};

export default deleteMessages;