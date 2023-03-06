import AnswerMember from "../../../utils/AnswerMember";
import { middleware } from "../../command.middleware";
import embedMessageFromInteraction from '../../utils/embed/createEmbedCollectorData.func';
import submitWarn from "./submitWarn.func";

const execCommandSlash = middleware.create('COMMAND_INTERACTION', async function (interaction, options, next) {
    const context = options.context;
    console.log(context)
    if (context.argument.isMessage) {
        if (context.data.member && context.data.message) {
            await submitWarn({ interaction, options, warn: options.context.data })
            await AnswerMember({
                interaction,
                content: { content: options.locale.command.warn.interaction.messageSubmit, ephemeral: true },
            });
        }
        next();
    } else if (context.argument.isEmbed) {
        await embedMessageFromInteraction({
            options, interaction,
            events: {
                async onSubmit(embed) {
                    await submitWarn({ interaction, options, warn: { embed, member: context.data.member } });
                    options.context.argument.embedMessage = embed;
                    next();
                },
            }
        });
    } else {
        next();
    }
});

export default execCommandSlash;