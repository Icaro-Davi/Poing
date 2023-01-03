import fs from 'fs';
import path from 'path';
import BaseLocale from './baseLocale';
import { BaseError } from './baseLocale/error.type';

export type Locale = BaseLocale;
export type LocaleLabel = 'pt-BR' | 'en-US';
export type LocaleErroTypes = keyof BaseError;

export const getAvailableLocales = () => {
    return fs.readdirSync(path.resolve(`${__dirname}/langs`)).map(locale => locale.replace(/(\.json|\.ts)/g, '')) as LocaleLabel[];
}

export const getLocale = async (localeLang: LocaleLabel) => {
    try {
        const _locale = (await import(`./langs/${localeLang}`)).default as Locale;
        return _locale;
    } catch (error) {
        throw error;
    }
}