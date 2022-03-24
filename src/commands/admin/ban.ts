import Discord from 'discord.js';
import { BotCommand } from "..";

const command: BotCommand = {
    name: 'ban',
    minArgs: 1,
    maxArgs: 1,
    getDescription: () => new Discord.MessageEmbed()
        .setDescription('!ban [@username]: This command will ban a user from server.'),
    exec: (message, args) => {
        const taggedUser = message.mentions.users.first();
        message.channel.send(`You want to ban: ${taggedUser?.username}`);
    }

}

export default command;