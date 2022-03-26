import { Collection, Message, MessageEmbed } from 'discord.js';

export type ExecuteCommand = (message: Message, args: string[]) => void;
export type BotCommands = Collection<string, BotCommand>;
export type BotGetHelp = (customPrefix?: string) => MessageEmbed;
export type BotArguments = { required: boolean; arg: string, description?: string  }[];
export type BotUsage = BotArguments[];
export type BotCommand = {
    name: string;
    getHelp: BotGetHelp,
    exec: ExecuteCommand;
    category: 'Administration'| 'Moderation' | 'Utility';
    description: string;
    usage?: BotUsage;
    getExamples?: (customPrefix?: string) => string[];
    aliases?: string[];   
}
