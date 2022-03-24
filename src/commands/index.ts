import { Message, MessageEmbed } from 'discord.js';

export type ExecuteCommand = (message: Message, args: string[]) => void;
export type BotCommand = {
    name: string,
    getDescription: () => MessageEmbed,
    exec: ExecuteCommand,
    minArgs?: number,
    maxArgs?: number
}
