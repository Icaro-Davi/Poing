import { ExecuteCommand } from "../../index.types";
import argument from "./command.args";
import memberInfo from "./memberInfo.func";

const execDefaultCommand: ExecuteCommand = async (message, args, options) => {
    const member = args.get(argument.MEMBER.name);
    if (member) return { content: await memberInfo(member, options), type: 'embed' };
}

export default execDefaultCommand;