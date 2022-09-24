import { getAvailableLocales, getLocale } from "../locale";

import type{ Locale, LocaleLabel } from "../locale";

class LocaleMemory {
    private static locales: Map<LocaleLabel, Locale> = new Map<LocaleLabel, Locale>();
    private static availableLocales: LocaleLabel[] = getAvailableLocales();

    static get(localeLang: LocaleLabel) {
        return this.locales.get(localeLang) as Locale;
    }

    static getLocaleLangs() {
        return this.availableLocales;
    }

    static addLocale(localeLang: LocaleLabel, Locale: Locale) {
        this.locales.set(localeLang, Locale);
    }

    static async loadLocales() {
        const promises: Promise<Locale>[] = [];
        this.availableLocales.forEach(localeLang => { promises.push(getLocale(localeLang)) });
        const locales = await Promise.all(promises);
        locales.forEach(locale => {
            this.locales.set(<LocaleLabel>locale.localeLabel, locale);
        });
    }
}

export default LocaleMemory;
