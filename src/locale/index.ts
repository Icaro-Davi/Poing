import objectPath from 'object-path';
import fs from 'fs';
import path from 'path';

import { BotCommand } from "../commands/index.types"
import { DiscordBot } from '../config/';
import getPathFromCurlyBrackets from '../utils/regex/getPathFromCurlyBrackets';
import defaultLocale from './example.locale.json';

export type Locale = typeof defaultLocale;
export type LocaleErroTypes = keyof typeof defaultLocale.error;
export type LocaleLabel = 'pt-BR' | 'en-US';

export const getInitialLocaleVars = async ({ optionalVars, locale }: { optionalVars?: object, locale?: LocaleLabel }) => ({
    bot: {
        name: DiscordBot.Bot.nickname,
        prefix: DiscordBot.Bot.defaultPrefix,
        '@mention': `<@${DiscordBot.Bot.ID}>`,
        hexColor: DiscordBot.Bot.defaultBotHexColor
    },
    ...locale ? { locale: await getLocale(locale) } : {},
    ...optionalVars ? optionalVars : {},
});

const translateCommandToLocale = async (command: BotCommand, locale: LocaleLabel) => {
    const defaultLocaleVars = await getInitialLocaleVars({
        optionalVars: {
            defaultCommand: {
                name: command.name
            },
        },
        locale
    });
    const translatedCommand = navigateToObjectDepthAndTranslate(command, defaultLocaleVars);
    return {
        locale: defaultLocaleVars.locale!,
        botCommand: translatedCommand,
        bot: defaultLocaleVars.bot
    };
}

export const replaceVarsInString = (str: string, vars: any): string => {
    const paths = getPathFromCurlyBrackets(str);
    if (paths) {
        str = paths.reduce<string>((prev, path, index) => {
            const value = objectPath.get(vars, path);
            return value ? prev.replaceAll(`{${path}}`, value) : prev.replaceAll(`{${path}}`, `[${paths[index]}]`);
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
                    const str: string = (command[current] as string)
                        .match(/\\?\[.+?\]/gm)
                        ?.reduce(((str, current) => current.match(/\\\[.+?\\?\]/)
                            ? str.replaceAll('\\]', ']').replaceAll('\\[', '[')
                            : str.replace(current, '')
                        ), command[current]) ?? command[current];
                    prev[current] = replaceVarsInString(str, locale);
                    return prev;
                default:
                    prev[current] = command[current];
                    return prev;
            }
        }, initialValue);
    }
    return translateCommands(command, {}) as BotCommand;
}

export const getAvailableLocales = () => {
    return fs.readdirSync(path.resolve(`${__dirname}/../../locale`)).map(locale => locale.replace(/(.json|.ts)/g, '')) as LocaleLabel[];
}

export const getLocale = async (localeLang: LocaleLabel) => {
    const _locale = (await import(`../../locale/${localeLang}`)).default as Locale;
    return _locale;
}

export default translateCommandToLocale;