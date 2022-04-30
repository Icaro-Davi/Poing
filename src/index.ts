import dotenv from 'dotenv';
dotenv.config();

import { DiscordBot } from './config';

DiscordBot.Client.start();