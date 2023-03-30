import { middleware } from "../../command.middleware";
import kickMember from "./kickMember.func";
import { executeMassKickWithVote } from "./MassKickCollector.func";

const execDefaultCommand = middleware.create('COMMAND', async function (message, args, options, next) {
    if (options.context.argument.isKick) {
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
        return;
    } else if (options.context.argument.isMassKick) {
        const userInput = await executeMassKickWithVote({ options, message })
            .catch(error => {
                next({ type: 'DISCORD_API', error })
            });
        if (userInput) {
            options.context.argument.members = userInput.kickedMembers.map(guildMember => `${guildMember.user.username}#${guildMember.user.discriminator}/<@${guildMember.id}>`);
            options.context.argument.vote = userInput.isVoteActive ? '✅' : '❌';
        }
        next();
        return;
    }
    next();
});

export default execDefaultCommand;