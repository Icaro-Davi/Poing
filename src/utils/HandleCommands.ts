export const HandleCommands = (message: string) => {
    const args = message.trim().slice(process.env.BOT_DEFAULT_PREFIX?.length).split(/ +/);
    const name = args.shift()?.toLocaleLowerCase() || '';
    return {
        name, args
    };
}