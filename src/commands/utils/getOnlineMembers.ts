import { ExecuteCommand, BotCommand } from '../';

const getOnlineMembers: ExecuteCommand = (message, args) => {
    message.reply(`Online Members: ${message.guild?.memberCount}`);
}

const command: BotCommand = {
    name: 'get-online-members',
    description: '!get-online-members: I will return the amount of online members in this server.',
    exec: getOnlineMembers
}

export default command;