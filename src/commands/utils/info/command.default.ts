import argument from "./command.args";
import memberInfo from "./memberInfo.func";

import type { ExecuteCommand } from "../../index.types";

const execDefaultCommand: ExecuteCommand = async function (message, args, options) {
    const member = args.get(argument.MEMBER(options).name);
    if (member) return { content: await memberInfo(member, options), type: 'embed' };
}

export default execDefaultCommand;