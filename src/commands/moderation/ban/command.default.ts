import { ExecuteCommand } from "../../index.types";
import argument from "./command.args";
import guildBanMember from './banMember.func';
import listBannedMembers from "./listBannedMembers.func";

const defaultCommand: ExecuteCommand = async (message, args, options) => {
    if (Array.isArray(args)) return;

    const banMember = args.get(argument.MEMBER.name);
    const list = args.get(argument.LIST.name);

    if (banMember) {
        const days = args.get(argument.DAYS.name);
        const reason = args.get(argument.REASON.name);

        const answer = guildBanMember({
            message,
            options: { ...options, days, reason, banMember }
        });
        return answer;
    }
    if (list) return listBannedMembers({ options, message });
}

export default defaultCommand;