import kickMember from "./kickMember.func";
import { middleware } from "../../command.middleware";

const execSlashCommand = middleware.create('COMMAND_INTERACTION', async function (interaction, options, next) {
    const kickedMember = options.context.data.kickedMember;
    const reason = options.context.data.reason;
    await kickMember({
        kickedMember, options, interaction, reason, ephemeral: true,
        onError(message) {
            next({ type: 'COMMAND_USER', message: { content: message, ephemeral: true } })
        },
        onFinish(params) {
            options.context.argument.kicked = params.kicked;
            next();
        },
    });
});

export default execSlashCommand;