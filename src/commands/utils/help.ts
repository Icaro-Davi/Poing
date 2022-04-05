import { Message, MessageEmbed } from "discord.js";
import objectPath from 'object-path';

import { BotCommand, ExecuteCommandOptions } from "..";
import { createGetHelp } from "../../utils/messageEmbed";
import { DiscordBot } from "../../config";
import MD from "../../utils/md";
import translateCommandToLocale, { Locale, LocaleLabel } from "../../locale";
import getPathFromCurlyBrackets from "../../utils/regex/getPathFromCurlyBrackets";

const getHelpAboutAnyCommand = async (message: Message, arg: string, options: ExecuteCommandOptions) => {
    const commandFromAliases = DiscordBot.Commands.AliasesCollection.get(arg);
    const defaultCommand = DiscordBot.Commands.Collection.get(commandFromAliases || arg);
    if (defaultCommand) {
        const locale = await translateCommandToLocale(defaultCommand, options.locale.localeLabel as LocaleLabel);
        return await message.reply({ embeds: [createGetHelp(locale.botCommand, options)] });
    }
    return await message.reply(`I do not know this argument ${MD.codeBlock.line(arg)}`);
}

const listAllCommands = (message: Message, locale: Locale) => {
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
        if (paths) category = objectPath.get(locale, paths[0]);
        return category;
    }
    return message.reply({
        embeds: [
            new MessageEmbed()
                .setColor(`#${process.env.BOT_MESSAGE_EMBED_HEX_COLOR}`)
                .setFields(Object.entries(commandsByCategory).map(category => ({
                    name: `${getEmojiByCategory(category[0])}${translateCategory(category[0])}`,
                    value: category[1].reduce((prev, current) => prev + ` ${MD.codeBlock.line(current)}`, '')
                })))
        ]
    });
}

const command: BotCommand = {
    name: 'help',
    category: '{category.utility}',
    description: '{command.help.description}',
    aliases: ['h'],
    usage: [
        [
            {
                required: false, arg: '{usage.command.arg}',
                description: '{usage.command.description}',
                example: '{command.help.usage.commandExample}'
            },
            {
                required: false, arg: '{usage.listHelp.arg}',
                description: '{usage.listHelp.description}',
                example: '{command.help.usage.listExample}'
            }
        ]
    ],
    exec: async (message, args, options) => {
        switch (args[0]) {
            case 'list':
                return await listAllCommands(message, options.locale);
            case undefined:
                return await listAllCommands(message, options.locale);
            default:
                return await getHelpAboutAnyCommand(message, args[0], options);
        }
    }
}

export default command;