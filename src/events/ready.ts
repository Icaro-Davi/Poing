import fs from 'fs';
import { DiscordBot } from '../config';
import { searchCommandsFiles } from "../utils/commands";

export default () =>
    DiscordBot.Client.get().on('ready', () => {
        DiscordBot.Client.get().user?.setActivity('!help list', {
            type: 'LISTENING',
            name: 'Poing Poing Poing',
            url: 'https://github.com/icaro-davi'
        });
        let commands = searchCommandsFiles('./src/commands');
        console.log( '\x1b[95m','\n\n', fs.readFileSync('./draw').toString(),'\x1b[0m')
        console.log(`\n\n\n-- I'm listening all :3`);
        console.log('--- Prefix:', process.env.BOT_PREFIX);
        console.log('--- Bot Name:', process.env.BOT_NAME);
        console.log('--- Quantity of Commands:', commands.length);
        console.log('--- Loaded Commands:', '\x1b[34m', commands.map(path => `[${path.split(/(?:\\|\/)/g).pop()}]`).join(' '), '\x1b[0m');
        console.log(`-- My creator is https://github.com/icaro-davi`);
    });