import argument from "./command.args";
import deleteMessages from "./deleteMessage.func";

import type { ExecuteSlashCommand } from "../../index.types";

const execSlashCommand: ExecuteSlashCommand = async function (interaction, options) {
    if (interaction.channel?.type === 'DM' || interaction.channel?.type === 'GUILD_VOICE') return;
    const arg = { QUANTITY: argument.QUANTITY(options) }
    const quantity = interaction.options.getNumber(arg.QUANTITY.name, arg.QUANTITY.required);
    if (!quantity) return;

    return await deleteMessages({ channel: interaction.channel!, locale: options.locale, ephemeral: true, quantity });
}

export default execSlashCommand;