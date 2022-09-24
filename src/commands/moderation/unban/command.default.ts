import argument from "./command.args";
import unbanMember from "./unbanMember.func";

import type { ExecuteCommand } from "../../index.types";

const execDefaultCommand: ExecuteCommand = async function (message, args, options) {
    const bannedMemberID = args.get(argument.MEMBER(options).name);
    const reason = args.get(argument.REASON(options).name);

    return await unbanMember({
        bannedMemberID,
        options, reason,
        author: message.author,
        guild: message.guild!,
    });
}

export default execDefaultCommand;