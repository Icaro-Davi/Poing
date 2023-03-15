import AnswerMember from "../../../utils/AnswerMember";
import { middleware } from "../../command.middleware";
import unbanMember from "./unbanMember.func";

const execSlashCommand = middleware.create('COMMAND_INTERACTION', async function (interaction, options, next) {
    const bannedMemberID = options.context.data.member;
    const reason = options.context.data.reason;

    await unbanMember({
        bannedMemberID, options, reason, interaction,
        onError(msg) {
            next({
                type: 'COMMAND_USER',
                message: { content: msg, ephemeral: true }
            });
        },
        async onFinish(msg) {
            await AnswerMember({
                content: { content: msg, ephemeral: true }
            });
            next();
        },
    });
});

export default execSlashCommand;