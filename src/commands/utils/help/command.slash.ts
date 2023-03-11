import { list } from "../../../components/messageEmbed";
import AnswerMember from "../../../utils/AnswerMember";
import { middleware } from "../../command.middleware";
import getCommandHelp from "./getCommandHelp.func";

const execSlashCommand = middleware.create('COMMAND_INTERACTION', async function (interaction, options, next) {
    if (options.context.argument?.isList) {
        const embed = await list.commandsByCategory(options);
        await AnswerMember({ interaction, content: { embeds: [embed], ephemeral: true } }); next();
        return;
    }
    if (options.context.argument?.isCommand) {
        await getCommandHelp({
            options, ephemeral: true, commandName: options.context.data.commandName,
            async onFinish(params) {
                await AnswerMember({ interaction, content: { embeds: [params.embed], components: [params.button], ephemeral: true } }); next();
            },
            async onError(message) {
                next({ type: 'COMMAND_USER', message: { content: message, ephemeral: true } });
            },
        });
        return;
    }
    const embed = await list.commandsByCategory(options);
    await AnswerMember({ interaction, content: { embeds: [embed], ephemeral: true } }); next();
});

export default execSlashCommand;