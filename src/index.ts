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
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ],
}));

const { aliasesCommandsKey, clientCommands } = getAllBotCommands();
DiscordBot.Commands.setCollection(clientCommands);
DiscordBot.Commands.setAliases(aliasesCommandsKey);

DiscordBot.Client.start();