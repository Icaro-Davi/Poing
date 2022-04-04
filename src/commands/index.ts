import { Collection, Message, MessageEmbed, PermissionResolvable } from 'discord.js';

export type ExecuteCommand = (message: Message, args: string[]) => void;
export type BotCommands = Collection<string, BotCommand>;
export type BotCommandCategory = 'Administration'| 'Moderation' | 'Utility';
export type BotGetHelp = (customPrefix?: string) => MessageEmbed;
export type BotArguments = { required: boolean; arg: string, description?: string; example?: string; requireArgIndex?: number; }[];
export type BotUsage = BotArguments[];
export type BotCommand = {
    name: string;
    exec: ExecuteCommand;
    category: BotCommandCategory;
    description: string;    
    allowedPermissions?: PermissionResolvable[];
    usage?: BotUsage;
    aliases?: string[];   
}
