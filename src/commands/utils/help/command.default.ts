import { list } from "../../../components/messageEmbed";
import AnswerMember from "../../../utils/AnswerMember";
import { middleware } from "../../command.middleware";
import getCommandHelp from "./getCommandHelp.func";

const execDefaultCommand = middleware.create('COMMAND', async function (message, args, options, next) {
    if (options.context.argument?.isList) {
        const embed = await list.commandsByCategory(options);
        await AnswerMember({ message, content: { embeds: [embed] } });
        next(); return;
    }

    if (options.context.argument.isCommand) {
        await getCommandHelp({
            options,
            commandName: options.context.data.commandName,
            async onFinish(params) {
                await AnswerMember({ message, content: { embeds: [params.embed], components: [params.button] } }); next();
            },
            async onError(message) {
                next({ type: 'COMMAND_USER', message: { content: message } });
            }
        }); return;
    }

    const embed = await list.commandsByCategory(options);
    await AnswerMember({ message, content: { embeds: [embed] } });
    next();
});

export default execDefaultCommand;