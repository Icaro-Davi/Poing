/**
 * To get value you must provide flags like
 * @param arg
 * @param flags [ '-example', '-e' ]
 */

// /-r(?:eason)?\s*"(.+?)(?:"\s*-|[^"]*$)/gm - answer from StackOverflow

const getValuesFromStringFlag = (args: string[], flags: string[]) => {
    // const regex = new RegExp(`(${flags.join('|')})(\\s+|[^\\s]?)"(.+?)\"[\\s-]?`, 'g');
    const regex = new RegExp(`(${flags.join('|')}) ?"(.+?)(?:"-|" -|"?$\\B)`, 'g');
    const result = regex.exec(args.join(' '));
    return result ? result[2] : undefined;
}

export type IteratorFlags = {
    flag: Map<string, string | string[] | boolean>;
    validFlags: string[];
    invalidFlags: string[];
}

type ValidFlags = {
    flags: string[];
    type: 'BOOLEAN' | 'STRING' | 'ARRAY'
}

export const getFlagsFromUserInput = (input: string, validFlags: { [key: string]: ValidFlags }) => {
    const regex = /(-{1,2}\w+)(?:\s+|=")((?:"(?:\\"|[^"])*")|(?:\S+))/g
    const iterator: IteratorFlags = {
        flag: new Map<string, string[]>(),
        validFlags: [],
        invalidFlags: []
    }

    for (const match of input.matchAll(regex)) {
        const flag = match[1];
        const flagKey = Object.keys(validFlags).find(key => validFlags[key].flags.some(validFlag => validFlag === flag));

        if (flagKey) {
            const flagValueType = validFlags[flagKey].type;
            const flagValue = match[2].replace(/^"(.+)"$/, "$1").replaceAll('\\"', '"');
            let isValidFlag = true;
            switch (flagValueType) {
                case 'BOOLEAN':
                    if (/^y(?:es)?$/.test(flagValue.toLocaleLowerCase().trim())) {
                        iterator.flag.set(flagKey, true);
                    } else if (/^n(?:o)?$/.test(flagValue.toLocaleLowerCase().trim())) {
                        iterator.flag.set(flagKey, false);
                    } else {
                        isValidFlag = false;
                    }
                    break;

                case 'ARRAY':
                    const values = iterator.flag.get(flagKey) ?? [];
                    if (Array.isArray(values)) {
                        iterator.flag.set(flagKey, [...values, flagValue]);
                    } else {
                        isValidFlag = false;
                    }
                    break;

                case 'STRING':
                    if (typeof flagValueType === 'string') {
                        iterator.flag.set(flagKey, flagValue);
                    } else {
                        isValidFlag = false;
                    }
                    break;

                default:
                    isValidFlag = false;
                    break;
            }
            isValidFlag
                ? !iterator.validFlags.includes(flag) && iterator.validFlags.push(flag)
                : !iterator.invalidFlags.includes(flag) && iterator.invalidFlags.push(flag);
        } else {
            iterator.invalidFlags.push(flag);
        }
    }

    return iterator;
}

export default getValuesFromStringFlag;