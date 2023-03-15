import AnswerMember from "../../../utils/AnswerMember";
import { middleware } from "../../command.middleware";
import unbanMember from "./unbanMember.func";

const execDefaultCommand = middleware.create('COMMAND', async function (message, args, options, next) {
    const bannedMemberID = options.context.data.member;
    const reason = options.context.data.reason;

    await unbanMember({
        bannedMemberID,
        options, reason, message,
        onError(msg) {
            next({
                type: 'COMMAND_USER',
                message: { content: msg }
            });
        },
        async onFinish(msg) {
            await AnswerMember({
                content: { content: msg }
            });
            next();
        },
    });
});

export default execDefaultCommand;