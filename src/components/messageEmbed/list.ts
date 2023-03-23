import { EmbedBuilder } from "discord.js";
import moment from "moment";
import { DiscordBot } from "../../config";
import MD from "../../utils/md";
import { replaceValuesInString  } from "../../utils/replaceValues";

import type { MutedMember } from "../../application/Mute";
import type { ExecuteCommandOptions } from "../../commands/index.types";

const commandsByCategory = (options: ExecuteCommandOptions) => {
    const commandsByCategory: { [key: string]: string[] } = {};
    DiscordBot.Command.Collection.forEach(commandFunc => {
        const BotCommand = commandFunc({ locale: options.locale });
        commandsByCategory[BotCommand.category]
            ? commandsByCategory[BotCommand.category].push(BotCommand.name)
            : commandsByCategory[BotCommand.category] = [BotCommand.name]
    });
    const getEmojiByCategory = (category: string) => {
        switch (category) {
            case options.locale.category.administration:
                return ':crown: ';
            case options.locale.category.moderation:
                return ':gear: '
            case options.locale.category.utility:
                return ':tools: ';
            default:
                return ''
        }
    }
    const translateCategory = (category: string) => {
        category = replaceValuesInString(category, { locale: options.locale });
        return category;
    }
    return new EmbedBuilder()
        .setColor(options.bot.hexColor || `#${process.env.BOT_MESSAGE_EMBED_HEX_COLOR}`)
        .setFields(Object.entries(commandsByCategory).map(category => ({
            name: `${getEmojiByCategory(category[0])}${translateCategory(category[0])}`,
            value: category[1].reduce((prev, current) => prev + ` ${MD.codeBlock.line(current)}`, '')
        })));
}

const mutedMembers = (mutedGuildMembers: MutedMember[], options: ExecuteCommandOptions) => {
    return new EmbedBuilder()
        .setColor(options.bot.hexColor)
        .setDescription(mutedGuildMembers.length
            ? mutedGuildMembers.reduce((str, member) => `${str}\n${MD.underline(`🤫${options.locale.labels.name}:`)} ${MD.codeBlock.line(member.name)} ${MD.underline(`⌛${options.locale.labels.ends}:`)} ${MD.codeBlock.line(moment(member.timeout).locale(options.locale.localeLabel).fromNow())}`, '')
            : options.locale.command.mute.interaction.noTimeSilencedMembers);
}

export default {
    commandsByCategory,
    mutedMembers
};