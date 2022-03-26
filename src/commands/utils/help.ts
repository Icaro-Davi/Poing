import { Message } from "discord.js";

import { BotCommand } from "..";
import { createGetHelp } from "../../utils/messageEmbed";
import { DiscordBot } from "../../config";
import MD from "../../utils/md";

const getHelpAboutAnyCommand = (message: Message, arg: string) => {
    const commandFromAliases = DiscordBot.Commands.AliasesCollection.get(arg);
    const command = DiscordBot.Commands.Collection.get(commandFromAliases || arg);
    if (command) return message.reply({ embeds: [command?.getHelp(process.env.BOT_PREFIX)] });
    return message.reply(`I do not know this command ${MD.codeBlock.line(arg)}`);
}

const listAllCommands = (message: Message) => {
    // console.log(DiscordBot.Commands.Collection.reduce((prev, current) => {
        
    // }, []))
    message.reply('In development');
}

const command: BotCommand = {
    name: 'help',
    category: 'Utility',
    description: 'Get help about any command',
    aliases: ['h'],
    usage: [
        [
            { required: true, arg: 'command', description: 'Any command i can use' },
        ]
    ],
    getHelp: (customPrefix) => createGetHelp(command, customPrefix),
    exec: (message, args) => {
        switch (args[0]) {
            case 'list':
                return listAllCommands(message);
            default:
                return getHelpAboutAnyCommand(message, args[0]);
        }
    }
}

export default command;