import { EmbedBuilder } from "discord.js";
import AnswerMember from "../../../utils/AnswerMember";
import { replaceValuesInString } from "../../../utils/replaceValues";
import { middleware } from "../../command.middleware";
import CreateEmbedFromString from '../../utils/embed/createEmbedFromString.func';
import submitWarn from "./submitWarn.func";

const execCommandDefault = middleware.create('COMMAND', async function (message, args, options, next) {
    const messageArgs = { ...options.context.data };

    if (!messageArgs.member) {
        const embed = new EmbedBuilder({
            title: options.locale.command.warn.components.verifyMemberArgument.title,
            description: replaceValuesInString(options.locale.command.warn.components.verifyMemberArgument.descriptionVerifySecondArgPosition, {
                '{argument_position}': '2°'
            })
        });
        await AnswerMember({
            message, content: { embeds: [embed] }
        });
        return;
    }

    if (options.context.argument.isMessage) {
        await submitWarn({
            message, options,
            warn: { ...messageArgs }
        });
        await AnswerMember({ message, content: { content: options.locale.command.warn.interaction.messageSubmit } });
        next();
    } else if (options.context.argument.isEmbed) {
        await CreateEmbedFromString({
            message, embedMessageFlags: messageArgs.embed, options, async onFinish(embed) {
                await submitWarn({ message, options, warn: { ...messageArgs, embed } });
            },
        });
        next();
    }
});

export default execCommandDefault;