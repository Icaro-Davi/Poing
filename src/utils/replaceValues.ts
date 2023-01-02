import objectPath from "object-path";

export const replaceValuesInString = (text: string, vars: any): string => {
    const regex = new RegExp('({[\\w\\.]+?})');
    return text.split(regex).map((textPart) => {
        if (regex.test(textPart)) {
            const pathValue = objectPath.get(vars, textPart.replaceAll(/({|})/g, ''));
            if (pathValue) return pathValue;
        }
        return textPart;
    }).join('');
}

export function replaceValuesInArray<T extends any[]>(target: T, vars: any) {
    return JSON.parse(replaceValuesInString(JSON.stringify(target), vars)) as T;
}

export function replaceValuesInObject<T extends { [key: string]: any }>(target: T, vars: { [key: string]: any }): T {
    return JSON.parse(replaceValuesInString(JSON.stringify(target), vars)) as T;
}
