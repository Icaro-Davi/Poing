import { middleware } from "../../command.middleware";
import kickMember from "./kickMember.func";

const execDefaultCommand = middleware.create('COMMAND', async function (message, args, options, next) {
    const kickedMember = options.context.data.kickedMember;
    const reason = options.context.data.reason;
    await kickMember({
        kickedMember, options, message, reason,
        onError(message) {
            next({ type: 'COMMAND_USER', message: { content: message } })
        },
        onFinish(params) {
            options.context.argument.kicked = params.kicked;
            next();
        },
    });
});

export default execDefaultCommand;