import DiscordJS from 'discord.js';
import fs from 'fs';

import { BotCommand } from '../commands';

export const splitCommandAndArgs = (message: string) => {
    const args = message.trim().slice(process.env.BOT_DEFAULT_PREFIX?.length).split(/ +/);
    const name = args.shift()?.toLocaleLowerCase() || '';
    return {
        name, args
    };
}

export const getAllBotCommands = () => {
    const clientCommands = new DiscordJS.Collection<string, BotCommand>();
    const commandPaths = searchCommandsFiles('./src/commands', '../');
    for (const path of commandPaths) {
        const command = require(path).default as BotCommand;
        clientCommands.set(command.name, command);
    }
    return clientCommands;
}

export const searchCommandsFiles = (dir: string, returnWithInitialPath = './') => {
    const ignoreFiles = ['index.ts'];
    const getPaths = (path: string, paths: string[]) => {
        fs.readdirSync(path).forEach(file => {
            if (fs.lstatSync(`${path}/${file}`).isFile() && !ignoreFiles.some(ignoreFile => ignoreFile === file)) paths.push(`${path}/${file}`);
            if (fs.lstatSync(`${path}/${file}`).isDirectory()) return getPaths(`${path}/${file}`, paths);
        });
        return paths;
    }
    return getPaths(dir, []).map(path => `${returnWithInitialPath}${path.split('/').slice(2).join('/')}`);
}