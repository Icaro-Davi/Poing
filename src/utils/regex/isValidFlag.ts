const isValidFlag = (flag: string, flags: string[], regexFlags: string = 'i') => {
    const regexStr = flags.reduce((str, current, i) => `${str}^${current}$${(flags.length - 1) > i ? '|' : ''}`, '');
    const regex = new RegExp(regexStr, regexFlags);
    return regex.test(flag);
}

export default isValidFlag;