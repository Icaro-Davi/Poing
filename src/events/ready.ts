import { ActivityType } from 'discord.js';
import fs from 'fs';
import { createNewEvent } from '.';
import { DiscordBot } from '../config';

export default createNewEvent('ready', () => {
    DiscordBot.Command.loadSlashCommands();
    DiscordBot.Client.get().guilds.cache.size;
    DiscordBot.Client.get().user?.setActivity({
        type: ActivityType.Listening,
        name: `I'm in ${DiscordBot.Client.get().guilds.cache.size} servers.`,
    });

    console.log('\x1b[95m', '\n\n', fs.readFileSync('./draw').toString(), '\x1b[0m')
    console.log(`\n\n\n-- I'm listening all :3`);
    console.log('--- Default Prefix:', process.env.BOT_PREFIX);
    console.log('--- Bot Name:', process.env.BOT_NAME);
    console.log('--- Guilds:', DiscordBot.Client.get().guilds.cache.size);
    console.log('--- Schedule Events', DiscordBot.ScheduleEvent.start() ? 'Online' : 'Offline');
    console.log('--- Locales:', DiscordBot.LocaleMemory.getLocaleLangs().map(lang => DiscordBot.LocaleMemory.get(lang)?.localeLabel).join(' '));
    console.log('--- Quantity of Commands:', DiscordBot.Command.Collection.size);
    console.log('--- MongoDB status', DiscordBot.Database.getMongoDBStatus());
    console.log(`-- My creator is https://github.com/icaro-davi`);
});