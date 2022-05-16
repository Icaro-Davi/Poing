import { ExecuteCommand } from "../../index.types";
import argument from "./command.args";
import deleteMessages from "./deleteMessage.func";

const execDefaultCommand: ExecuteCommand = async (message, args, options) => {
    if (message.channel.type === 'DM' || Array.isArray(args)) return;
    const quantity = args.get(argument.QUANTITY.name) as number;
    if (!quantity) return;

    return await deleteMessages({ channel: message.channel, locale: options.locale, quantity });
}

export default execDefaultCommand;