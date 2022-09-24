import { list } from "../../../components/messageEmbed";
import argument from "./command.args";
import getCommandHelp from "./getCommandHelp.func";

import type { ExecuteCommand } from "../../index.types";

const execDefaultCommand: ExecuteCommand = async function (message, args, options) {
    const commandName = args.get(argument.COMMAND(options).name);
    const _list = args.get(argument.LIST(options).name);

    if (commandName) return await getCommandHelp({ commandName, options });
    if (_list) return { content: list.commandsByCategory(options), type: 'embed' };
    return { content: list.commandsByCategory(options), type: 'embed' }

}

export default execDefaultCommand;