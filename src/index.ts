import dotenv from 'dotenv';
import pkg from '../package.json';
import path from 'path';
import fs from 'fs';

const getRoot = (_path: string): string => {
    const splitPath = path.resolve(_path).split(/\\|\//);
    if (splitPath[splitPath.length - 1].toLocaleLowerCase() === pkg.name) return _path;
    else {
        splitPath.pop();
        return getRoot(splitPath.join('/'));
    }
}
const prodPath = path.resolve(getRoot(__dirname), '.env');
const envFilePath = (fs.existsSync(prodPath)) ? prodPath : path.resolve(__dirname, '../', '.env.development.local');

dotenv.config({ path: envFilePath, debug: true });
import { DiscordBot } from './config';
DiscordBot.Client.start();