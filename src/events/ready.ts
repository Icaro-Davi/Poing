import fs from 'fs';
import { DiscordBot } from '../config';

export default () =>
    DiscordBot.Client.on('ready', () => {
        DiscordBot.Command.loadSlashCommands();
        DiscordBot.Client.get().user?.setActivity(`Call me baby @${DiscordBot.Bot.nickname} help`, {
            type: 'LISTENING',
            name: 'Poing Poing Poing',
            url: 'https://github.com/icaro-davi'
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