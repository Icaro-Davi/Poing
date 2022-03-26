import { BotCommand } from "..";
import { createGetHelp } from '../../utils/messageEmbed';

const command: BotCommand = {
    name: 'ban',
    category: 'Moderation',
    usage: [
        [{ required: true, arg: 'username|nickname|mention', description: 'The reference of any member' }]
    ],
    description: 'Ban any member from the server',
    getExamples: (customPrefix) => [
        `\'${customPrefix || process.env.BOX_PREFIX}${command.name} @JohnDoe\'\nIs required mention anyone to ban`
    ],
    getHelp: (customPrefix) => createGetHelp(command, customPrefix),
    exec: (message, args) => {
        const taggedUser = message.mentions.users.first();
        message.channel.send(`You want to ban: ${taggedUser?.username}`);
    }
}

export default command;