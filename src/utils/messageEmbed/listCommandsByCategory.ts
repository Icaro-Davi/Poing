import { MessageEmbed } from "discord.js";
import objectPath from "object-path";
import { ExecuteCommandOptions } from "../../commands";
import { DiscordBot } from "../../config";
import MD from "../md";
import getPathFromCurlyBrackets from "../regex/getPathFromCurlyBrackets";

const listCommandsByCategory = (options: ExecuteCommandOptions) => {
    const commandsByCategory: { [key: string]: string[] } = {};
    DiscordBot.Commands.Collection.forEach(BotCommand => {
        commandsByCategory[BotCommand.category]
            ? commandsByCategory[BotCommand.category].push(BotCommand.name)
            : commandsByCategory[BotCommand.category] = [BotCommand.name]
    });
    const getEmojiByCategory = (category: string) => {
        switch (category) {
            case '{category.administration}':
                return ':crown: ';
            case '{category.utility}':
                return ':gear: '
            case '{category.moderation}':
                return ':tools: ';
            default:
                return ''
        }
    }
    const translateCategory = (category: string) => {
        let paths = getPathFromCurlyBrackets(category);
        if (paths) category = objectPath.get(options.locale, paths[0]);
        return category;
    }
    return new MessageEmbed()
        .setColor(`#${process.env.BOT_MESSAGE_EMBED_HEX_COLOR}`)
        .setFields(Object.entries(commandsByCategory).map(category => ({
            name: `${getEmojiByCategory(category[0])}${translateCategory(category[0])}`,
            value: category[1].reduce((prev, current) => prev + ` ${MD.codeBlock.line(current)}`, '')
        })))
}

export default listCommandsByCategory;