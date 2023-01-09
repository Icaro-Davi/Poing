import type { ApplicationCommandOptionData, Collection, ColorResolvable, CommandInteraction, Message, MessageEmbed, PermissionResolvable } from 'discord.js';
import type { Locale, LocaleLabel } from '../locale';
import type { CommandHandler } from '../config/command';

export type BotArgumentFilterFunction = (args: string[]) => any | void;
export type ExecuteCommandReturn = Promise<Partial<Omit<CommandHandler, 'message'>> | void>;
export type ExecuteCommand = (this: BotCommand, message: Message, args: FilterType, options: ExecuteCommandOptions) => ExecuteCommandReturn;
export type ExecuteSlashCommand = (this: BotCommand, message: CommandInteraction, options: ExecuteCommandOptions) => ExecuteCommandReturn;
export type BotCommands = Collection<string, BotCommand>;
export type BotCommandCategory = 'Administration' | 'Moderation' | 'Utility';
export type BotGetHelp = (customPrefix?: string) => MessageEmbed;
export type BotUsage = BotArgument[][];
export type CreateFilterFunc = (message: Message, args: string[], locale: Locale, data?: any) => any;
export type FilterFunc = (message: Message, args: string[], locale: Locale, data?: any) => Promise<{ data: any, required?: boolean; }>;

export type BotDefinitions = {
    name: string;
    prefix: string;
    hexColor: ColorResolvable;
    '@mention': string;
}

type FilterType = {
    get: (argName: string) => any;
    data: {
        [key: string]: any;
    };
    defaultArgs: string[];
}

export type BotArgument = {
    required: boolean;
    name: string;
    description: string;
    isFlag?: boolean;
    filter?: FilterFunc;
};

export type BotArgumentFunc = (options: { locale: Locale; required?: boolean; argIndex?: number }) => BotArgument;

export type ExecuteCommandOptions = {
    locale: Locale;
    bot: BotDefinitions;
}

export type BotCommand = {
    name: string;
    aliases?: string[];
    execDefault: ExecuteCommand;
    execSlash?: ExecuteSlashCommand;
    category: BotCommandCategory | string;
    description: string;
    allowedPermissions?: PermissionResolvable[];
    slashCommand?: ApplicationCommandOptionData[];
    usage?: BotUsage;
}

export type BotCommandFunc = ((options: { locale: Locale }) => BotCommand);