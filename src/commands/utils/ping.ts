import { BotCommand, ExecuteCommand } from "..";

const ping: ExecuteCommand = (message, args) => {
    message.reply('Wait ping...').then(resultMessage => (
        message.reply(`...Pong, your latency ${resultMessage.createdTimestamp - message.createdTimestamp}ms`)
    ));
}

const command: BotCommand = {
    name: 'ping',
    description: '!ping: This command sends the reply time to bot responds your server.',
    exec: ping
}

export default command;

