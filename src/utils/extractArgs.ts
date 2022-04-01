const getValuesFromFlags = (args: string[], flags: string[]) => {
    const regex = new RegExp(`(${flags.join('|')})\s+\"(.+?)\"[\s-]?`, 'g');
    const result = regex.exec(args.join(' '));
    return result ? result[2] : undefined;
}

export default getValuesFromFlags;