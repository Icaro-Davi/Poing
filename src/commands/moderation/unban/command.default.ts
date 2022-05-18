import { ExecuteCommand } from "../../index.types";
import argument from "./command.args";
import unbanMember from "./unbanMember.func";

const execDefaultCommand: ExecuteCommand = async (message, args, options) => {
    if (Array.isArray(args)) return;

    const bannedMemberID = args.get(argument.MEMBER.name);
    const reason = args.get(argument.REASON.name);

    return await unbanMember({
        bannedMemberID,
        options, reason,
        author: message.author,
        guild: message.guild!,
     });
}

export default execDefaultCommand;