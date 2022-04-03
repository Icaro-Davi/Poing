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

export default getValuesFromStringFlag;