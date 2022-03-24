import Discord from 'discord.js';
import { BotCommand, ExecuteCommand } from "..";

const ping: ExecuteCommand = (message, args) => {
    message.channel.send('...').then(resultMessage => (
        message.reply(`...Pong, your latency ${resultMessage.createdTimestamp - message.createdTimestamp}ms`)
    ));
}

const command: BotCommand = {
    name: 'ping',
    getDescription: () => new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle(`Command ${command.name}`)
        .setDescription('I will send you the time in milliseconds (ms) it takes me to reply to you.'),
    exec: ping
}

export default command;

