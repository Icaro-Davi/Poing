import argument from "./command.args";
import guildBanMember from './banMember.func';
import listBannedMembers from "./listBannedMembers.func";
import softBanMember from "./softBan.func";

import type { ExecuteCommand } from "../../index.types";

const defaultCommand: ExecuteCommand = async function (message, args, options) {
    const banMember = args.get(argument.MEMBER(options).name);
    const list = args.get(argument.LIST(options).name);
    const softBan = args.get(argument.SOFT(options).name);

    if (banMember) {
        if (softBan)
            return await softBanMember(banMember, message.author, { bot: options.bot, locale: options.locale, message });

        const days = args.get(argument.DAYS(options).name);
        const reason = args.get(argument.REASON(options).name);
        const answer = guildBanMember({
            message,
            options: { ...options, days, reason, banMember }
        });
        return answer;
    }
    if (list) return listBannedMembers({ options, message });
}

export default defaultCommand;