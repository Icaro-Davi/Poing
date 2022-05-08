import { BotCommand, ExecuteCommandOptions, ExecuteCommandReturn } from "../index.types";
import { createGetHelp, list } from "../../components/messageEmbed";
import { DiscordBot } from "../../config";
import MD from "../../utils/md";
import translateCommandToLocale, { LocaleLabel } from "../../locale";
import locale from '../../locale/example.locale.json';

const getHelpAboutAnyCommand = async (arg: string, options: ExecuteCommandOptions): ExecuteCommandReturn => {
    const commandFromAliases = DiscordBot.Command.AliasesCollection.get(arg);
    const defaultCommand = DiscordBot.Command.Collection.get(commandFromAliases || arg);
    if (defaultCommand) {
        const locale = await translateCommandToLocale(defaultCommand, options.locale.localeLabel as LocaleLabel);
        return { content: createGetHelp(locale.botCommand, options), type: 'embed' };
    }
    return { content: options.locale.interaction.iDontKnowThisArgument, vars: { arg: MD.codeBlock.line(arg) } };
}

const command: BotCommand = {
    name: 'help',
    category: locale.category.utility,
    description: locale.command.help.description,
    aliases: ['h'],
    usage: [
        [
            {
                required: false, name: locale.usage.argument.command.arg,
                description: locale.usage.argument.command.description,
                example: locale.command.help.usage.commandExample
            },
            {
                required: false, name: locale.command.help.usage.list.arg,
                description: locale.command.help.usage.list.description,
                example: locale.command.help.usage.list.example
            }
        ]
    ],
    execDefault: async (message, args, options) => {
        switch (args[0]) {
            case 'list':
                return { content: list.commandsByCategory(options), type: 'embed' };
            case undefined:
                return { content: list.commandsByCategory(options), type: 'embed' };
            default:
                return await getHelpAboutAnyCommand(args[0], options);
        }
    }
}

export default command;