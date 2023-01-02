import { Awaitable, ClientEvents } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { DiscordBot } from '../config';

const startListeningEvents = () => {
    const ignoreFiles = ['index.ts'];
    fs.readdirSync(path.resolve(`${__dirname}`))
        .filter(file => file.match(/(.+?)(\.ts|\.js)$/g)?.length && !ignoreFiles.some(ignoreFile => ignoreFile.split('.')[0] === file.split('.')[0]))
        .forEach(file => require(`./${file}`).default());
}

export function createNewEvent<K extends keyof ClientEvents>(event: K, eventFunc: (event: K, ...args: ClientEvents[K]) => Awaitable<void>) {
    return () => DiscordBot.Client.on(event, (...args) => eventFunc(event, ...args));
}

export default startListeningEvents;