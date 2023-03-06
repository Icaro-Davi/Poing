import { MessageEmbed } from "discord.js";
import AnswerMember from "../../../utils/AnswerMember";
import { replaceValuesInString } from "../../../utils/replaceValues";
import { MiddlewareCommandFunc } from "../../command.middleware";
import embedCommandCreateEmbedFunc from '../../utils/embed/createEmbedFromString.func';
import submitWarn from "./submitWarn.func";

const execCommandDefault: MiddlewareCommandFunc = async function (message, args, options, next) {
    const messageArgs = { ...options.context.data };

    if (!messageArgs.member) {
        const embed = new MessageEmbed({
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
        await message.reply(options.locale.command.warn.interaction.messageSubmit);
        next();
    } else if (options.context.argument.isEmbed) {
        await embedCommandCreateEmbedFunc({
            message, embedMessageFlags: messageArgs.embed, options, async onFinish(embed) {
                await submitWarn({ message, options, warn: { ...messageArgs, embed } });
            },
        });
        next();
    }
}

export default execCommandDefault;