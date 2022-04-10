import { Message, PermissionResolvable } from 'discord.js';

import { BotUsage } from '../commands';
import { DiscordBot } from '../config';
import { splitCommandAndArgs } from '../utils/commands';
import translateCommandToLocale from '../locale';
import handleError from '../utils/handleError';
import { createGetHelp } from '../components/messageEmbed';

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
        const options = {
            locale: locale.get,
            bot: {
                name: DiscordBot.Bot.nickname,
                prefix: DiscordBot.Bot.defaultPrefix,
                hexColor: DiscordBot.Bot.defaultBotHexColor,
            }
        }
        try {
            if (botCommand.usage && anyArgumentIsRequired(command.args, botCommand.usage)) {
                await message.reply({ embeds: [createGetHelp(locale.botCommand, options)] });
                return;
            }
            if (botCommand.allowedPermissions?.length && memberDoesNotHavePermissions(message, botCommand.allowedPermissions)) {
                await message.reply(options.locale.interaction.youDontHavePermission);
                return;
            }
            await locale.botCommand.exec(message, command.args, options);
        } catch (error) {
            handleError(error, {
                errorLocale: 'event/messageCreate',
                locale: locale.get,
                message: message
            });
        }
    });