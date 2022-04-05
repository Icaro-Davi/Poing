const getPathFromCurlyBrackets = (str: string) => {
    const regex = /{(.+?)}/g;
    const paths = str.match(regex);
    if (paths)
        return paths.map(path => path.replaceAll(/(?:{|})/g, ''));
}

export default getPathFromCurlyBrackets;