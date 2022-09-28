import objectPath from "object-path";
import getPathFromCurlyBrackets from "./regex/getPathFromCurlyBrackets";

export const replaceValuesInString = (str: string, vars: any): string => {
    const paths = getPathFromCurlyBrackets(str);
    if (paths) {
        str = paths.reduce<string>((prev, path, index) => {
            const value = objectPath.get(vars, path);
            return value ? prev.replaceAll(`{${path}}`, value) : prev.replaceAll(`{${path}}`, `[${paths[index]}]`);
        }, str);
        return replaceValuesInString(str, vars);
    }
    else
        return str;
}

export function replaceValuesInArray<T extends any[]>(target: T, vars: any) {
    const array = <T>target.map(value => {
        if (typeof value === 'string')
            return replaceValuesInString(value, vars);
        else if (Array.isArray(value))
            return replaceValuesInArray(value, vars);
        else if (typeof value === 'object')
            return replaceValuesInObject(value, vars);
        else
            return value;
    });
    return array
}

export function replaceValuesInObject<T extends { [key: string]: any }>(target: T, vars: { [key: string]: any }): T {
    return Object.entries(target).reduce((prev, [key, value]) => {
        switch (typeof value) {
            case 'string':
                return { ...prev, [key]: replaceValuesInString(value, vars) };
            case 'object':
                return { ...prev, [key]: Array.isArray(value) ? replaceValuesInArray(value, vars) : replaceValuesInObject(value, vars) };
            default:
                return prev;
        }
    }, {}) as T;
}
