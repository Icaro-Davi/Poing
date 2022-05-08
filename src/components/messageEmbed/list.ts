import { MessageEmbed } from "discord.js";
import { ExecuteCommandOptions } from "../../commands/index.types";
import { DiscordBot } from "../../config";
import MD from "../../utils/md";
import locale from "../../locale/example.locale.json";
import { replaceVarsInString } from "../../locale";
import { MutedMember } from "../../application/Mute";
import moment from "moment";

const commandsByCategory = (options: ExecuteCommandOptions) => {
    const commandsByCategory: { [key: string]: string[] } = {};
    DiscordBot.Command.Collection.forEach(BotCommand => {
        commandsByCategory[BotCommand.category]
            ? commandsByCategory[BotCommand.category].push(BotCommand.name)
            : commandsByCategory[BotCommand.category] = [BotCommand.name]
    });
    const getEmojiByCategory = (category: string) => {
        switch (category) {
            case locale.category.administration:
                return ':crown: ';
            case locale.category.moderation:
                return ':gear: '
            case locale.category.utility:
                return ':tools: ';
            default:
                return ''
        }
    }
    const translateCategory = (category: string) => {
        category = replaceVarsInString(category, { locale: options.locale });
        return category;
    }
    return new MessageEmbed()
        .setColor(options.bot.hexColor || `#${process.env.BOT_MESSAGE_EMBED_HEX_COLOR}`)
        .setFields(Object.entries(commandsByCategory).map(category => ({
            name: `${getEmojiByCategory(category[0])}${translateCategory(category[0])}`,
            value: category[1].reduce((prev, current) => prev + ` ${MD.codeBlock.line(current)}`, '')
        })));
}

const mutedMembers = (mutedGuildMembers: MutedMember[], options: ExecuteCommandOptions) => {
    return new MessageEmbed()
        .setColor(options.bot.hexColor)
        .setDescription(mutedGuildMembers.reduce((str, member) => `${str}\n${MD.underline(`🤫${options.locale.labels.name}:`)} ${MD.codeBlock.line(member.name)} ${MD.underline(`⌛${options.locale.labels.ends}:`)} ${MD.codeBlock.line(moment(member.timeout).locale(options.locale.localeLabel).fromNow())}`, ''));
}

export default {
    commandsByCategory,
    mutedMembers
};