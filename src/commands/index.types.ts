import { ApplicationCommandOptionData, Collection, ColorResolvable, CommandInteraction, Message, MessageEmbed, PermissionResolvable } from 'discord.js';
import { Locale } from '../locale';
import { CommandHandler } from '../config/command';

// export type FilterFunc = (message: Message) => string;
export type BotArgumentFilterFunction = (args: string[]) => any | void;
export type ExecuteCommandReturn = Promise<Partial<Omit<CommandHandler, 'message'>> | void>;
export type ExecuteCommand = (message: Message, args: string[] | FilterType, options: ExecuteCommandOptions) => ExecuteCommandReturn;
export type ExecuteSlashCommand = (message: CommandInteraction, options: ExecuteCommandOptions) => ExecuteCommandReturn;
export type BotCommands = Collection<string, BotCommand>;
export type BotCommandCategory = 'Administration' | 'Moderation' | 'Utility';
export type BotGetHelp = (customPrefix?: string) => MessageEmbed;
export type BotUsage = BotArgument[][];
export type FilterFunc = (message: Message, args: string[], locale: Locale, data?: any) => any;

export type BotDefinitions = {
    name: string;
    prefix: string;
    hexColor: ColorResolvable;
    '@mention': string;
}
// export type ExecuteDefaultCommand = (message: Message, args: {
//     get: (argName: string) => any;
//     data: {
//         [key: string]: any;
//     };
// }, options: ExecuteCommandOptions) => ExecuteCommandReturn;

type FilterType = {
    get: (argName: string) => any;
    data: {
        [key: string]: any;
    };
}

export type BotArgument = {
    required: boolean;
    name: string,
    description: string;
    isFlag?: boolean;
    example?: string;
    filter?: FilterFunc;
};

export type ExecuteCommandOptions = {
    locale: Locale;
    bot: BotDefinitions;
}

export type BotCommand = {
    name: string;
    howToUse: string;
    execDefault: ExecuteCommand;
    execSlash?: ExecuteSlashCommand;
    category: BotCommandCategory | string;
    description: string;
    allowedPermissions?: PermissionResolvable[];
    slashCommand?: ApplicationCommandOptionData[];
    usage?: BotUsage;
    aliases?: string[];
}
