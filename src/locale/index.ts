import fs from 'fs';
import path from 'path';

import defaultLocale from './example.locale.json';

export type Locale = typeof defaultLocale;
export type LocaleErroTypes = keyof typeof defaultLocale.error;
export type LocaleLabel = 'pt-BR' | 'en-US';

export const getAvailableLocales = () => {
    return fs.readdirSync(path.resolve(`${__dirname}/../../locale`)).map(locale => locale.replace(/(\.json|\.ts)/g, '')) as LocaleLabel[];
}

export const getLocale = async (localeLang: LocaleLabel) => {
    const _locale = (await import(`../../locale/${localeLang}`)).default as Locale;
    return _locale;
}