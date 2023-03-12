import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const prodPath = path.resolve(__dirname, '../', '.env');
const envFilePath = (fs.existsSync(prodPath)) ? prodPath : path.resolve(__dirname, '../', '.env.development.local');

dotenv.config({ path: envFilePath, debug: true });
import { DiscordBot } from './config';
DiscordBot.Client.start();