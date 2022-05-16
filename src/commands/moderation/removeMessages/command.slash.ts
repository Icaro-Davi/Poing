import { ExecuteSlashCommand } from "../../index.types";
import argument from "./command.args";
import deleteMessages from "./deleteMessage.func";

const execSlashCommand: ExecuteSlashCommand = async (interaction, options) => {
    if (interaction.channel?.type === 'DM') return;
    const quantity = interaction.options.getNumber(argument.QUANTITY.name, argument.QUANTITY.required);
    if (!quantity) return;

    return await deleteMessages({ channel: interaction.channel!, locale: options.locale, ephemeral: true, quantity });
}

export default execSlashCommand;