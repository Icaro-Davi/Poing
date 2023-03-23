import { DiscordBot } from '../config';
import handleError from '../utils/handleError';

import type { Message } from 'discord.js';
import type { Locale } from '../locale';
import HexColorToNumber from '../utils/HexColorToNumber';
import { isAllowedToUseThisCommand } from './command.utils';
import type { BotCommand, ExecuteCommandOptions } from './index.types';

export const getArgs = async (options: { message: Message, command: BotCommand, args: string[], locale: Locale }) => {
    try {
        const filters: { [key: string]: any } = {};
        const args = {
            get: (argName: string) => filters[argName],
            data: filters,
            defaultArgs: options.args
        }

        if (!options.command.usage) return args;

        for (let args of options.command.usage) {
            const checkedArgs: { failed: boolean; required: boolean; }[] = [];
            for (let arg of args) {
                if (typeof filters[`${arg.name}`] === 'undefined') {
                    const filterResult = arg.filter ? await arg.filter(options.message, options.args, options.locale, filters) : undefined;
                    filters[`${arg.name}`] = filterResult?.data;
                    checkedArgs.push({ failed: typeof filterResult?.data === 'undefined', required: !!filterResult?.required });
                }
            }
            if (checkedArgs.length && checkedArgs.every(arg => arg.required && arg.failed)) {
                if (!options.args.length)
                    throw new Error(options.locale.interaction.needArguments);
                else throw new Error(options.locale.interaction.verifyTheArguments);
            }
        }
        return args;
    } catch (err: any) {
        handleError(err, {
            errorLocale: 'src/commands/command.default',
            locale: options.locale,
            message: options.message,
            customMessage: err.message,
        });
    }
}

export const findInMessageAValidPrefix = (message: Message, prefix?: string) => {
    const botMentionPrefix = message.mentions.users.first()?.id === message.guild?.client.user.id ? `<@${message.mentions.users.first()?.id}> ` : undefined;
    const messageStartWithPrefix = (message: Message, prefix: string) => message.content.startsWith(prefix);
    if (prefix && messageStartWithPrefix(message, prefix ?? DiscordBot.Bot.defaultPrefix)) return prefix ?? DiscordBot.Bot.defaultPrefix;
    else if (botMentionPrefix && messageStartWithPrefix(message, botMentionPrefix)) return botMentionPrefix;
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

        const botConf = await DiscordBot.GuildMemory.getConfigs(message.guildId);
        const prefix = findInMessageAValidPrefix(message, botConf.prefix);
        if (!prefix) return;

        const initialCommand = splitArgs(message.content, prefix);
        const _command = DiscordBot.Command.search(initialCommand.name);
        if (!_command) return;

        const locale = DiscordBot.LocaleMemory.get(botConf.locale);
        _locale = locale;

        const botCommand = _command({ locale });

        if (await isAllowedToUseThisCommand({ message, allowedPermissions: botCommand.allowedPermissions, locale })) return;
        if (await isAllowedToUseThisCommand({ message, allowedPermissions: botCommand.botPermissions, locale, isBot: true })) return;

        const options: ExecuteCommandOptions = {
            bot: {
                channel: botConf?.channel,
                name: DiscordBot.Bot.name,
                "@mention": `<@${DiscordBot.Bot.ID}>`,
                hexColor: HexColorToNumber(botConf.messageEmbedHexColor ?? DiscordBot.Bot.defaultBotHexColor),
                prefix: botConf.prefix ?? DiscordBot.Bot.defaultPrefix,
            },
            locale,
            context: { data: {}, argument: {} },
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
