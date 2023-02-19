import addMuteRole from "./addMuteRole.func";
import argument from "./command.args";
import listMutedMembers from "./listMutedMembers.func";
import { MuteGuildMember } from "./muteGuildMember.func";

import type { ExecuteCommand } from "../../index.types";

const execDefaultCommand: ExecuteCommand = async function (message, args, options) {
    const muteMember = args.get(argument.MEMBER(options).name);
    const muteRole = args.get(argument.ADD_ROLE(options).name);
    const list = args.get(argument.LIST(options).name);

    if (muteMember) {
        const time = args.get(argument.TIME(options).name);
        const reason = args.get(argument.REASON(options).name);
        return await MuteGuildMember({
            options,
            reason,
            muteTime: time,
            mutedMember: muteMember,
            message
        });
    }
    if (muteRole) return { content: await addMuteRole({ guild: message.guild!, role: muteRole, locale: options.locale }) };
    if (list) return { content: await listMutedMembers({ guild: message.guild!, options }), type: 'embed' };
}

export default execDefaultCommand;