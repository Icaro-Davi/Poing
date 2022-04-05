import { Message, PermissionResolvable } from 'discord.js';

import { BotUsage } from '../commands';
import { DiscordBot } from '../config';
import { splitCommandAndArgs } from '../utils/commands';
import MD from '../utils/md';
import translateCommandToLocale from '../locale';

const itIsANormalMessage = (message: Message) => {
    return (!message.content.startsWith(process.env.BOT_PREFIX || '!') || message.author.bot)
}

const searchBotCommand = (botCommand: string) => {
    const commandFromAliases = DiscordBot.Commands.AliasesCollection.get(botCommand);
    return DiscordBot.Commands.Collection.get(commandFromAliases || botCommand);
}

const anyArgumentIsRequired = (args: string[], usage: BotUsage) => {
    const argsRequiredByIndex = usage.map(args => args.reduce((prev, current) => prev + Number(current.required), 0));
    return !argsRequiredByIndex.every((requiredIndex, i) => requiredIndex ? i < args.length : true);
}

const memberDoesNotHavePermissions = (message: Message, allowedPermissions: PermissionResolvable[]) => {
    return !allowedPermissions.some(permission => message.member?.permissions.has(permission));
}

export default () =>
    DiscordBot.Client.get().on('messageCreate', async (message) => {
        if (itIsANormalMessage(message)) return;
        const command = splitCommandAndArgs(message.content);
        const botCommand = searchBotCommand(command.name);
        if (!botCommand) return;
        const locale = await translateCommandToLocale({ ...botCommand }, 'pt-BR');
        try {
            if (botCommand.usage && anyArgumentIsRequired(command.args, botCommand.usage)) {
                message.reply(`I do not understand what are you order to me, please use ${MD.codeBlock.line(process.env.BOT_PREFIX + 'help ' + command.name)} to learn about this command.`);
                return;
            }
            if (botCommand.allowedPermissions?.length && memberDoesNotHavePermissions(message, botCommand.allowedPermissions)) {
                message.reply('You does not have permission to execute this command.');
                return;
            }
            await locale.botCommand.exec(message, command.args, {
                locale: locale.get,
                bot: {
                    name: DiscordBot.Bot.nickname,
                    prefix: DiscordBot.Bot.defaultPrefix,
                    hexColor: DiscordBot.Bot.defaultBotHexColor,
                }
            });
        } catch (error) {
            console.error(error);
            await message.reply(`Sorry, i think i have a bug in that command, i will try to kill it.`);
        }
    });