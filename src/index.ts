import DiscordJS, { Intents } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

import { DiscordBot } from './config';
import { getAllBotCommands } from './utils/commands';

DiscordBot.Client.set(new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_PRESENCES,        
    ]
}));

const { aliasesCommandsKey, clientCommands } = getAllBotCommands();
DiscordBot.Commands.setCollection(clientCommands);
DiscordBot.Commands.setAliases(aliasesCommandsKey);

DiscordBot.Client.start();