import DiscordJS, { Intents } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

import BotListeners from './listeners';
import { getAllBotCommands } from './utils/commands';

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

const botCommands = getAllBotCommands();
BotListeners(client, botCommands);

client.login(process.env.BOT_TOKEN);
