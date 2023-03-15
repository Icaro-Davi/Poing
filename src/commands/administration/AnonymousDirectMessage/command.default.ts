import AnswerMember from "../../../utils/AnswerMember";
import { middleware } from "../../command.middleware";
import { sendDirectMessage } from "./sendMessage.func";

const defaultCommand = middleware.create('COMMAND', async function (message, args, options, next) {
    const member = options.context.data.member;
    const anonymousMessage = options.context.data.message;

    await sendDirectMessage({
        options, message, anonymousMessage, mention: member,
        onError(message) {
            next({
                type: 'COMMAND_USER',
                message: { content: message }
            });
        },
        async onFinish() {
            await AnswerMember({
                content: { content: options.locale.command.anonymousDirectMessage.interaction.messageSent }
            });
            next();
        },
    });
});

export default defaultCommand;