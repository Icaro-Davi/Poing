import { list } from "../../../components/messageEmbed";
import argument from "./command.args";
import getCommandHelp from "./getCommandHelp.func";

import type { ExecuteSlashCommand } from "../../index.types";

const execSlashCommand: ExecuteSlashCommand = async function (interaction, options) {
    const subCommand = interaction.options.getSubcommand(true);
    const arg = {
        COMMAND: argument.COMMAND(options),
        LIST: argument.LIST(options),
        TARGET: argument.TARGET(options),
    }
    if (subCommand === arg.LIST.name)
        return { content: list.commandsByCategory(options), type: 'embed', ephemeral: true };
    if (subCommand === arg.COMMAND.name)
        return await getCommandHelp({
            options,
            ephemeral: true,
            commandName: interaction.options.getString(arg.TARGET.name, arg.TARGET.required)!,
        });
    return { content: list.commandsByCategory(options), type: 'embed', ephemeral: true };
}

export default execSlashCommand;