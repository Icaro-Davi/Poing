import LocaleExample from '../../src/locale/example.locale.json';
import fs from 'fs';
import path from 'path';
import { Locale, replaceVarsInString } from '../../src/locale';

describe('Test Locale Files', () => {
    it('All locale .json should exact same of example.locale.json', async () => {
        const localeFilePath = `${__dirname}/../../locale`;
        const localeFileList = fs.readdirSync(path.resolve(localeFilePath));

        const searchDiferenceBetweenLocaleFilesAndExample = (LocaleExample: any, locale: any, fileName: string): boolean => {
            const verify = (key: string) => {
                if (typeof LocaleExample[key] === 'string') {
                    const result = replaceVarsInString(LocaleExample[key] as string, { locale });
                    if (result)
                        return true;
                    else {
                        console.error(LocaleExample[key], 'does not exists in file:', fileName);
                        return false;
                    }
                }
                if (Array.isArray(LocaleExample[key])) {
                    console.error('Needs implements test for array type');
                    return false;
                }
                if (typeof LocaleExample[key] === 'object') {
                    if (!locale[key]) {
                        console.error({
                            name: `This object don't exists in file: ${fileName}`,
                            [key]: LocaleExample[key],
                        });
                        return false;
                    }
                    return searchDiferenceBetweenLocaleFilesAndExample(LocaleExample[key], locale[key], fileName);
                }
                return false;
            }
            return Object.keys(LocaleExample).map(verify).every(_boolean => _boolean);
        }

        const booleans: boolean[] = [];
        for (const localeFile of localeFileList) {
            const locale = (await import(`${path.resolve(`${localeFilePath}/${localeFile}`)}`)).default as Locale;
            let result = searchDiferenceBetweenLocaleFilesAndExample(LocaleExample, locale, localeFile);
            booleans.push(result);
        }
        expect(booleans.every(_boolean => _boolean)).toBeTruthy();
    });
});