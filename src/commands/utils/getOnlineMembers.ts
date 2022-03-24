import Discord from 'discord.js';
import { ExecuteCommand, BotCommand } from '../';

const getOnlineMembers: ExecuteCommand = (message, args) => {
    message.reply(`Online Members: ${message.guild?.memberCount}`);
}

const command: BotCommand = {
    name: 'get-online-members',
    getDescription: () => new Discord.MessageEmbed({})
        .setColor('GREEN')
        .setTitle(`Command ${process.env.BOT_PREFIX}${command.name}`)
        .setDescription('!get-online-members: I will return the amount of online members in this server.'),
    exec: getOnlineMembers
}

export default command;
