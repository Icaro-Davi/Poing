import argument from "./command.args";
import deleteMessages from "./deleteMessage.func";

import type { ExecuteCommand } from "../../index.types";

const execDefaultCommand: ExecuteCommand = async function (message, args, options) {
    if (message.channel.type === 'DM' || message.channel.type === 'GUILD_VOICE') return;
    const quantity = args.get(argument.QUANTITY(options).name) as number;

    return await deleteMessages({ channel: message.channel , locale: options.locale, quantity });
}

export default execDefaultCommand;