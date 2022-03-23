import DiscordJS, { Intents } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

import { HandleCommands } from './utils/HandleCommands';
import { GetAllClientCommands } from './commands';

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});
const clientCommands = GetAllClientCommands();

client.on('ready', () => {
    console.log(`-- I'm listening all :3`);
    console.log('--- Prefix:', process.env.BOT_DEFAULT_PREFIX);
    console.log('--- Bot Name:', process.env.BOT_NAME);
    console.log('--- Commands Available:', clientCommands.keys());
    console.log(`-- My creator is https://github.com/icaro-davi`);
});

client.on('messageCreate', (message) => {
    if (!message.content.startsWith(process.env.BOT_DEFAULT_PREFIX || '') || message.author.bot) return;
    const command = HandleCommands(message.content);
    if (!clientCommands.has(command.name)) return;
    try {
        clientCommands.get(command.name)?.exec(message, command.args);
    } catch (error) {
        console.error(error);
        message.reply(`Sorry, i think i have a bug in that command, i will try to kill it.`);
    }
});

client.login(process.env.BOT_TOKEN);
