import { ExecuteCommand } from "../../index.types";
import { argument } from "./command.args";
import guildBanMember from './banMember.func';

const defaultCommand: ExecuteCommand = async (message, args, options) => {
    if (Array.isArray(args)) return;

    const banMember = args.get(argument.MEMBER.name);
    const days = args.get(argument.DAYS.name);
    const reason = args.get(argument.REASON.name);

    const answer = guildBanMember({
        message,
        options: { ...options, days, reason, banMember }
    });

    return answer;
}

export default defaultCommand;