import AnswerMember from "../../../utils/AnswerMember";
import { middleware } from "../../command.middleware";
import { sendDirectMessage } from "./sendMessage.func";

const slashCommand = middleware.create('COMMAND_INTERACTION', async function (interaction, options, next) {
    const user = options.context.data.member;
    const anonymousMessage = options.context.data.message;

    if (!user) return;
    if (!anonymousMessage) return;

    await sendDirectMessage({
        anonymousMessage, interaction, options,
        mention: interaction.guild?.members.cache.find(member => member.id === user?.id),
        onError(message) {
            next({ type: 'COMMAND_USER', message: { content: message } });
        },
        async onFinish() {
            await AnswerMember({
                interaction,
                content: { content: options.locale.command.anonymousDirectMessage.interaction.messageSent, ephemeral:true }
            });
            next();
        },
    });
});

export default slashCommand;