import AnswerMember from "../../../utils/AnswerMember";
import CommandError from "../../command.error";
import { middleware } from "../../command.middleware";
import addMuteRole from "./addMuteRole.func";
import listMutedMembers from "./listMutedMembers.func";
import { MuteGuildMember } from "./muteGuildMember.func";

const execDefaultCommand = middleware.create('COMMAND', async function (message, args, options, next) {
    if (options.context.argument.isMuteMember) {
        const muteMember = options.context.data.member;
        const time = options.context.data.time;
        const reason = options.context.data.reason;
        await MuteGuildMember({
            options,
            reason,
            muteTime: time,
            mutedMember: muteMember,
            message,
            onError() {
                throw new CommandError({ type: 'UNKNOWN' });
            },
        });
        next();
    } else if (options.context.argument.isAddRole) {
        const muteRole = options.context.data.role;
        await addMuteRole({
            guild: message.guild!, role: muteRole, locale: options.locale,
            async onError(msg) {
                next({ type: 'COMMAND_USER', message: { content: msg } });
            },
            async onFinish(msg) {
                await AnswerMember({ message, content: { content: msg } });
                next();
            },
        });
    } else if (options.context.argument.isList) {
        const embed = await listMutedMembers({ guild: message.guild!, options });
        await AnswerMember({ message, content: { embeds: [embed] } });
        next();
    } else {
        next({ type: 'UNKNOWN' });
    }
});

export default execDefaultCommand;