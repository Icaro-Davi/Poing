import type { ApplicationCommandOptionData, ChatInputCommandInteraction, Collection, ColorResolvable, EmbedBuilder, Message, PermissionResolvable } from 'discord.js';
import type { CommandHandler } from '../config/command';
import { IChannelSchema } from '../domain/bot/Bot.schema';
import type { Locale } from '../locale';
import { MiddlewareCommandFunc, MiddlewareSlashCommandFunc } from './command.middleware';

export type BotArgumentFilterFunction = (args: string[]) => any | void;
export type ExecuteCommandReturn = Promise<Partial<Omit<CommandHandler, 'message'>> | void>;
export type ExecuteCommand = <T extends CommandOptionsContext>(this: BotCommand, message: Message, args: FilterType, options: ExecuteCommandOptions<T>) => ExecuteCommandReturn;
export type ExecuteSlashCommand = <T extends CommandOptionsContext>(this: BotCommand, message: ChatInputCommandInteraction, options: ExecuteCommandOptions<T>) => ExecuteCommandReturn;
export type BotCommands = Collection<string, BotCommand>;
export type BotCommandCategory = 'Administration' | 'Moderation' | 'Utility';
export type BotGetHelp = (customPrefix?: string) => EmbedBuilder;
export type BotUsage = BotArgument[][];
export type CreateFilterFunc = (message: Message, args: string[], locale: Locale, data?: any) => any;
export type FilterFunc = (message: Message, args: string[], locale: Locale, data?: any) => Promise<{ data: any, required?: boolean; }>;

export type BotDefinitions = {
    name: string;
    prefix: string;
    hexColor: number;
    '@mention': string;
    channel?: IChannelSchema;
}

type FilterType = {
    get: (argName: string) => any;
    data: {
        [key: string]: any;
    };
    defaultArgs: string[];
}

export type BotArgument = {
    required?: boolean;
    name: string;
    description: string;
    isFlag?: boolean;
    filter?: FilterFunc;
};

export type BotArgumentFunc = (options: { locale: Locale; required?: boolean; argIndex?: number }) => BotArgument;

type CommandOptionsContext = { [key: string]: any; data: any; argument: any; };
export type ExecuteCommandOptions<T = CommandOptionsContext> = {
    locale: Locale;
    bot: BotDefinitions;
    context: T,
}

export type BotCommand = {
    name: string;
    aliases?: string[];
    commandPipeline: MiddlewareCommandFunc[];
    slashCommandPipeline: MiddlewareSlashCommandFunc[];
    category: BotCommandCategory | string;
    description: string;
    allowedPermissions?: PermissionResolvable[];
    botPermissions?: PermissionResolvable[];
    slashCommand?: ApplicationCommandOptionData[];
    usage?: BotUsage;
}

export type BotCommandFunc = ((options: { locale: Locale }) => BotCommand);