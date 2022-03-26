import { DiscordBot } from '../config';
import { splitCommandAndArgs } from '../utils/commands';
import MD from '../utils/md';

export default () =>
    DiscordBot.Client.get().on('messageCreate', (message) => {
        if (!message.content.startsWith(process.env.BOT_PREFIX || '!') || message.author.bot) return;
        const command = splitCommandAndArgs(message.content);
        const commandFromAliases = DiscordBot.Commands.AliasesCollection.get(command.name);
        const botCommand = DiscordBot.Commands.Collection.get(commandFromAliases || command.name);
        if (!botCommand) return;
        try {
            const requiredCount = botCommand
                .usage?.reduce((prev, current) => [...prev, ...current], [])
                .reduce((prev, current) => current.required ? prev + 1 : prev, 0);
            if (requiredCount && (requiredCount > command.args.length)) {
                message.reply(`I do not understand what are you order to me, please use ${MD.codeBlock.line(process.env.BOT_PREFIX+'h '+command.name)} to learn about this command.`);
                return;
            }
            botCommand.exec(message, command.args);
        } catch (error) {
            console.error(error);
            message.reply(`Sorry, i think i have a bug in that command, i will try to kill it.`);
        }
    });