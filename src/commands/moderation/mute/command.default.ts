import { ExecuteCommand } from "../../index.types";
import addMuteRole from "./addMuteRole.func";
import argument from "./command.args";
import listMutedMembers from "./listMutedMembers.func";
import { MuteGuildMember } from "./muteGuildMember.func";

const execDefaultCommand: ExecuteCommand = async (message, args, options) => {
    const muteMember = args.get(argument.MEMBER.name);
    const muteRole = args.get(argument.ADD_ROLE.name);
    const list = args.get(argument.LIST.name);

    if (muteMember) {
        const time = args.get(argument.TIME.name);
        const reason = args.get(argument.REASON.name);
        return await MuteGuildMember({
            options,
            reason,
            muteTime: time,
            author: message.author,
            guild: message.guild!,
            mutedMember: muteMember,
        });
    }
    if (muteRole) return { content: await addMuteRole({ guild: message.guild!, role: muteRole, locale: options.locale }) };
    if (list) return { content: await listMutedMembers({ guild: message.guild!, options }), type: 'embed' };
}

export default execDefaultCommand;