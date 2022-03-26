import { BotCommand, ExecuteCommand } from "..";
import { createGetHelp } from '../../utils/messageEmbed';

const ping: ExecuteCommand = (message, args) => {
    message.channel.send('...').then(resultMessage => (
        message.reply(`...Pong, your latency ${resultMessage.createdTimestamp - message.createdTimestamp}ms`)
    ));
}

const command: BotCommand = {
    name: 'ping',
    category: 'Utility',
    description: 'I will send you the time in milliseconds (ms) it takes me to reply to you.',
    aliases: ['p'],
    getHelp: (customPrefix) => createGetHelp(command, customPrefix),
    exec: ping
}

export default command;

