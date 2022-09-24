import argument from "./command.args";
import kickMember from "./kickMember.func";

import type { ExecuteCommand } from "../../index.types";

const execDefaultCommand: ExecuteCommand = async function (message, args, options) {
    const kickedMember = args.get(argument.MEMBER(options).name);
    const reason = args.get(argument.REASON(options).name);

    return kickMember({ kickedMember, options, message, reason });
}

export default execDefaultCommand;