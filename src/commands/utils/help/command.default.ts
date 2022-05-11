import { list } from "../../../components/messageEmbed";
import { ExecuteCommand } from "../../index.types";
import argument from "./command.args";
import getCommandHelp from "./getCommandHelp.func";

const execDefaultCommand: ExecuteCommand = async (message, args, options) => {
    if (Array.isArray(args)) return;

    const commandName = args.get(argument.COMMAND.name);
    const _list = args.get(argument.LIST.name);

    if (commandName) return await getCommandHelp(commandName, options);
    if (_list) return { content: list.commandsByCategory(options), type: 'embed' };
    return { content: list.commandsByCategory(options), type: 'embed' }

}

export default execDefaultCommand;