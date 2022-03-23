import { BotCommand, ExecuteCommand } from "..";

const ban: ExecuteCommand = (message, args) => {
    const taggedUser = message.mentions.users.first();
    message.channel.send(`You want to ban: ${taggedUser?.username}`);
}

const command: BotCommand = {
    name: 'ban',
    // minArgs: 1,
    description: '!ban [@username]: This command will ban a user from server.',
    exec: ban
}

export default command;