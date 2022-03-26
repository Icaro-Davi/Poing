import { ExecuteCommand, BotCommand } from '..';
import { createGetHelp } from '../../utils/messageEmbed';

const getOnlineMembers: ExecuteCommand = (message, args) => {
    message.reply(`Online Members: ${message.guild?.memberCount}`);
}

const command: BotCommand = {
    name: 'get-online-members',
    category: 'Utility',
    description: 'I will return the amount of online members in this server.',
    aliases: ['gom', 'online-count'],
    getHelp: (customPrefix) => createGetHelp(command, customPrefix),
    exec: getOnlineMembers
}

export default command;
