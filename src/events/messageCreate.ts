import { Message, PermissionResolvable } from 'discord.js';

import { BotUsage } from '../commands';
import { DiscordBot } from '../config';
import { splitCommandAndArgs } from '../utils/commands';
import translateCommandToLocale from '../locale';
import handleError from '../utils/handleError';
import { createGetHelp } from '../components/messageEmbed';
import { Bot } from '../application';

export const itIsANormalMessage = (message: Message, prefix: string) => {
    return (!message.content.startsWith(prefix));
}

export const searchBotCommand = (botCommand: string) => {
    const commandFromAliases = DiscordBot.Commands.AliasesCollection.get(botCommand);
    return DiscordBot.Commands.Collection.get(commandFromAliases || botCommand);
}

export const anyArgumentIsRequired = (args: string[], usage: BotUsage) => {
    const argsRequiredByIndex = usage.map(args => args.reduce((prev, current) => prev + Number(current.required), 0));
    return !argsRequiredByIndex.every((requiredIndex, i) => requiredIndex ? i < args.length : true);
}

export const memberDoesNotHavePermissions = (message: Message, allowedPermissions: PermissionResolvable[]) => {
    return !allowedPermissions.some(permission => message.member?.permissions.has(permission));
}

export const eventMessageCreate = async (message: Message) => {
    if (!message.guildId || message.author.bot) return;

    const botConf = await Bot.getConfigurations(message.guildId);

    const botMention = message.mentions.users.first()?.id === process.env.BOT_ID ? `<@${message.mentions.users.first()?.id}> ` : undefined;
    if (itIsANormalMessage(message, (botMention ?? botConf.prefix) || DiscordBot.Bot.defaultPrefix)) return;

    const command = splitCommandAndArgs(message.content, botMention ?? botConf.prefix);
    const botCommand = searchBotCommand(command.name);
    if (!botCommand) return;

    const locale = await translateCommandToLocale({ ...botCommand }, botConf.locale);
    const options = {
        locale: locale.get,
        bot: {
            name: DiscordBot.Bot.nickname,
            prefix: botConf.prefix || DiscordBot.Bot.defaultPrefix,
            hexColor: botConf.embedMessageColor || DiscordBot.Bot.defaultBotHexColor,
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
}

export default () => DiscordBot.Client.get().on('messageCreate', eventMessageCreate);