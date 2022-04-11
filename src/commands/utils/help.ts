import { Message } from "discord.js";

import { BotCommand, ExecuteCommandOptions } from "..";
import { createGetHelp, listCommandsByCategory } from "../../components/messageEmbed";
import { DiscordBot } from "../../config";
import MD from "../../utils/md";
import translateCommandToLocale, { LocaleLabel } from "../../locale";

const getHelpAboutAnyCommand = async (message: Message, arg: string, options: ExecuteCommandOptions) => {
    const commandFromAliases = DiscordBot.Commands.AliasesCollection.get(arg);
    const defaultCommand = DiscordBot.Commands.Collection.get(commandFromAliases || arg);
    if (defaultCommand) {
        const locale = await translateCommandToLocale(defaultCommand, options.locale.localeLabel as LocaleLabel);
        return await message.reply({ embeds: [createGetHelp(locale.botCommand, options)] });
    }
    return await message.reply(`${options.locale.interaction.iDontKnowThisArgument} ${MD.codeBlock.line(arg)}`);
}

const command: BotCommand = {
    name: 'help',
    category: '{category.utility}',
    description: '{command.help.description}',
    aliases: ['h'],
    usage: [
        [
            {
                required: false, arg: '{usage.command.arg}',
                description: '{usage.command.description}',
                example: '{command.help.usage.commandExample}'
            },
            {
                required: false, arg: '{command.help.usage.list.arg}',
                description: '{command.help.usage.list.description}',
                example: '{command.help.usage.list.example}'
            }
        ]
    ],
    exec: async (message, args, options) => {
        switch (args[0]) {
            case 'list':
                return await message.reply({ embeds: [listCommandsByCategory(options)] });
            case undefined:
                return await message.reply({ embeds: [listCommandsByCategory(options)] });
            default:
                return await getHelpAboutAnyCommand(message, args[0], options);
        }
    }
}

export default command;