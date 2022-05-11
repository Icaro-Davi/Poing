import { list } from "../../../components/messageEmbed";
import { ExecuteSlashCommand } from "../../index.types";
import argument from "./command.args";
import getCommandHelp from "./getCommandHelp.func";

const execSlashCommand: ExecuteSlashCommand = async (interaction, options) => {
    const subCommand = interaction.options.getSubcommand(true);
    if (subCommand === argument.LIST.name)
        return { content: list.commandsByCategory(options), type: 'embed', ephemeral: true };
    if (subCommand === argument.COMMAND.name)
        return await getCommandHelp(interaction.options.getString(argument.TARGET.name, argument.TARGET.required)!, options);
    return { content: list.commandsByCategory(options), type: 'embed', ephemeral: true };
}

export default execSlashCommand;