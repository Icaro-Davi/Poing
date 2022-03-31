import { Message, MessageEmbed } from "discord.js";

import { BotCommand, BotCommandCategory } from "..";
import { createGetHelp } from "../../utils/messageEmbed";
import { DiscordBot } from "../../config";
import MD from "../../utils/md";

const getHelpAboutAnyCommand = (message: Message, arg: string) => {
    const commandFromAliases = DiscordBot.Commands.AliasesCollection.get(arg);
    const command = DiscordBot.Commands.Collection.get(commandFromAliases || arg);
    if (command) return message.reply({ embeds: [command?.getHelp(process.env.BOT_PREFIX)] });
    return message.reply(`I do not know this argument ${MD.codeBlock.line(arg)}`);
}

const listAllCommands = (message: Message) => {
    const commandsByCategory: { [key: string]: string[] } = {};
    DiscordBot.Commands.Collection.forEach(BotCommand => {
        commandsByCategory[BotCommand.category]
            ? commandsByCategory[BotCommand.category].push(BotCommand.name)
            : commandsByCategory[BotCommand.category] = [BotCommand.name]
    });
    const getEmojiByCategory = (category: BotCommandCategory) => {
        switch (category) {
            case 'Administration':
                return ':crown: ';
            case 'Utility':
                return ':gear: '
            case 'Moderation':
                return ':tools: ';
            default:
                return ''
        }
    }
    return message.reply({
        embeds: [
            new MessageEmbed()
                .setColor(`#${process.env.BOT_MESSAGE_EMBED_HEX_COLOR}`)
                .setFields(Object.entries(commandsByCategory).map(category => ({
                    name: `${getEmojiByCategory(category[0] as BotCommandCategory)}${category[0]}`,
                    value: category[1].reduce((prev, current) => prev + ` ${MD.codeBlock.line(current)}`, '')
                })))
        ]
    });
}

const command: BotCommand = {
    name: 'help',
    category: 'Utility',
    description: `Get help on any command, ${MD.bold.b('at least 1 argument is required')}.`,
    aliases: ['h'],
    usage: [
        [
            {
                required: false, arg: 'command',
                description: 'Any command i can use.',
                example: `${MD.codeBlock.line('{prefix}help who')} Will return help about ${MD.codeBlock.line('{prefix}who')} command.`
            },
            {
                required: false, arg: 'list',
                description: 'List all commands.',
                example: `${MD.codeBlock.line('{prefix}help list')} It will list all my commands.`
            }
        ]
    ],
    getHelp: (customPrefix) => createGetHelp(command, customPrefix),
    exec: (message, args) => {
        switch (args[0]) {
            case 'list':
                return listAllCommands(message);
            case undefined:
                return listAllCommands(message);
            default:
                return getHelpAboutAnyCommand(message, args[0]);
        }
    }
}

export default command;