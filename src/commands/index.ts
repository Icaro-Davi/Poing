import { Collection, Message, MessageEmbed, PermissionResolvable } from 'discord.js';
import { Locale } from '../locale';

export type ExecuteCommandOptions = {
    locale: Locale;
    bot: {
        name: string;
        prefix: string;
        hexColor: string;
    }
}
export type ExecuteCommand = (message: Message, args: string[], options: ExecuteCommandOptions) => void;
export type BotCommands = Collection<string, BotCommand>;
export type BotCommandCategory = 'Administration'| 'Moderation' | 'Utility';
export type BotGetHelp = (customPrefix?: string) => MessageEmbed;
export type BotArguments = { required: boolean; arg: string, description?: string; example?: string; requireArgIndex?: number; }[];
export type BotUsage = BotArguments[];
export type BotCommand = {
    name: string;
    exec: ExecuteCommand;
    category: BotCommandCategory | string;
    description: string;    
    allowedPermissions?: PermissionResolvable[];
    usage?: BotUsage;
    aliases?: string[];   
}
