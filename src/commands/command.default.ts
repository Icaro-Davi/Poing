import { Message, PermissionResolvable } from 'discord.js';
import { BotApplication } from '../application';
import { DiscordBot } from '../config';
import translateCommandToLocale, { Locale } from '../locale';
import handleError from '../utils/handleError';
import { BotCommand, BotUsage, ExecuteCommandOptions } from './index.types';

export const getArgs = async (options: { message: Message, command: BotCommand, args: string[], locale: Locale }) => {
    try {
        const filters: { [key: string]: any } = {};
        if (!options.command.usage) return;

        for (let args of options.command.usage) {
            for (let arg of args) {
                const data = arg.filter ? await arg.filter(options.message, options.args, options.locale) : undefined;
                filters[`${arg.name}`] = data;
            }
        }

        return {
            get: (argName: string) => filters[argName],
            data: filters
        }
    } catch (err: any) {
        err && await options.message.reply(err.message);
    }
}

export const memberDoesNotHavePermissions = (message: Message, allowedPermissions: PermissionResolvable[]) => {
    return !allowedPermissions.some(permission => message.member?.permissions.has(permission));
}

export const anyArgumentIsRequired = (args: string[], usage: BotUsage) => {
    const argsRequiredByIndex = usage.map(args => args.reduce((prev, current) => prev + Number(current.required), 0));
    return !argsRequiredByIndex.every((requiredIndex, i) => requiredIndex ? i < args.length : true);
}

export const itIsANormalMessage = (message: Message, prefix: string) => {
    return (!message.content.startsWith(prefix));
}

export const splitArgs = (message: string, botPrefix: string) => {
    const args = message.trim().slice(botPrefix.length || process.env.BOT_PREFIX!.length).split(/ +/);
    const name = args.shift()?.toLocaleLowerCase() || '';
    return { name, args }
};

const getDefaultCommand = async (message: Message) => {
    let _locale: Locale | undefined = undefined;
    try {
        if (!message.guildId || message.author.bot) return;

        const botConf = await BotApplication.getConfigurations(message.guildId);

        const botMention = message.mentions.users.first()?.id === message.guild?.me?.id ? `<@${message.mentions.users.first()?.id}> ` : undefined;
        if (itIsANormalMessage(message, (botMention ?? botConf.prefix) || DiscordBot.Bot.defaultPrefix)) return;

        const initialCommand = splitArgs(message.content, botMention ?? botConf.prefix);
        const defaultCommand = DiscordBot.Command.search(initialCommand.name);
        if (!defaultCommand) return;

        const { botCommand, locale, bot } = await translateCommandToLocale({ ...defaultCommand }, botConf.locale);
        _locale = locale;

        const options: ExecuteCommandOptions = {
            bot,
            locale
        }

        if (botCommand.allowedPermissions?.length && memberDoesNotHavePermissions(message, botCommand.allowedPermissions)) {
            await message.reply(options.locale.interaction.youDontHavePermission);
            return;
        }

        const args = await getArgs({
            message,
            args: initialCommand.args,
            command: botCommand,
            locale
        });

        if (!args) return;

        return {
            args,
            options,
            command: botCommand,
        }

    } catch (error) {
        _locale ? handleError(error, {
            message,
            errorLocale: 'src/commands/index.utils',
            locale: _locale
        }) : console.error('[src/commands/index.utils]', error);
    }
}

export default getDefaultCommand;
