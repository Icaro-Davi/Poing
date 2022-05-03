import { Collection, ColorResolvable, Message, MessageEmbed, PermissionResolvable } from 'discord.js';
import { Locale } from '../locale';
import { CommandHandler } from '../config/commands';

export type ExecuteCommandOptions = {
    locale: Locale;
    bot: {
        name: string;
        prefix: string;
        hexColor: ColorResolvable;
    }
}

export type BotArgumentFilterFunction = (args: string[]) => any | void;
export type ExecuteCommandReturn = Promise<Partial<Omit<CommandHandler, 'message'>> | void>;
export type ExecuteCommand = (message: Message, args: string[], options: ExecuteCommandOptions) => ExecuteCommandReturn;
export type BotCommands = Collection<string, BotCommand>;
export type BotCommandCategory = 'Administration' | 'Moderation' | 'Utility';
export type BotGetHelp = (customPrefix?: string) => MessageEmbed;
export type BotArguments = { required: boolean; arg: string, description?: string; example?: string; requireArgIndex?: number; filters?: BotArgumentFilterFunction[] }[];
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
