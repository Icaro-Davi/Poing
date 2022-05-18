import { ExecuteCommand } from "../../index.types";
import argument from "./command.args";
import kickMember from "./kickMember.func";

const execDefaultCommand: ExecuteCommand = async (message, args, options) => {
    const kickedMember = args.get(argument.MEMBER.name);
    const reason = args.get(argument.REASON.name);

    return kickMember({ kickedMember, options, message, reason });
}

export default execDefaultCommand;