import { middleware } from "../../command.middleware";
import kickMember from "./kickMember.func";
import { executeMassKickWithVote } from "./MassKickCollector.func";

const execSlashCommand = middleware.create('COMMAND_INTERACTION', async function (interaction, options, next) {
    if (options.context.argument.isKick) {
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
    } else if (options.context.argument.isMassKick) {
        const userInput = await executeMassKickWithVote({ options, interaction })
            .catch(error => {
                next({ type: 'DISCORD_API', error })
            });
        if (userInput) {
            options.context.argument.members = userInput.kickedMembers.map(guildMember => `${guildMember.user.username}#${guildMember.user.discriminator}/<@${guildMember.id}>`).join(' ');
            options.context.argument.vote = userInput.isVoteActive ? '✅' : '❌';
        }
        next();
    }
});

export default execSlashCommand;