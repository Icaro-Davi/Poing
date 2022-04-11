import objectPath from 'object-path';

import { BotCommand } from "../commands"
import { DiscordBot } from '../config/';
import getPathFromCurlyBrackets from '../utils/regex/getPathFromCurlyBrackets';
import defaultLocale from './example.locale.json';

export type Locale = typeof defaultLocale;
export type LocaleErroTypes = keyof typeof defaultLocale.error;
export type LocaleLabel = 'pt-BR' | 'en-US';

const translateCommandToLocale = async (command: BotCommand, locale: LocaleLabel) => {
    const _locale = await import(`../../locale/${locale}.json`) as Locale;    
    const translatedCommand = navigateToObjectDepthAndTranslate(command, {
        ..._locale,
        defaultCommand: {
            name: command.name
        },
        bot: {
            name: DiscordBot.Bot.nickname,
            prefix: DiscordBot.Bot.defaultPrefix,
        }
    });
    return {
        get: _locale,
        botCommand: translatedCommand
    };
}

export const replaceVarsInString = (str: string, vars: any): string => {
    const paths = getPathFromCurlyBrackets(str);
    if (paths) {
        str = paths.reduce((prev, path) => {
            return prev.replaceAll(`{${path}}`, objectPath.get(vars, path));
        }, str);
        return replaceVarsInString(str, vars);
    }
    else return str;
}

export const navigateToObjectDepthAndTranslate = (command: any, locale: any) => {
    const translateCommands = (command: any, initialValue: { [key: string]: any | any[] }) => {
        return Object.keys(command).reduce((prev, current) => {
            switch (typeof command[current]) {
                case 'object':
                    if (Array.isArray(command[current])) {
                        prev[current] = translateCommands(command[current], []);
                        return prev;
                    }
                    prev[current] = translateCommands(command[current], {});
                    return prev;
                case 'string':
                    prev[current] = replaceVarsInString(command[current], locale);
                    return prev;
                default:
                    prev[current] = command[current];
                    return prev;
            }
        }, initialValue);
    }
    return translateCommands(command, {}) as BotCommand;
}

export default translateCommandToLocale;