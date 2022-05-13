import { createGetHelp } from "../../../components/messageEmbed";
import { DiscordBot } from "../../../config";
import translateCommandToLocale, { LocaleLabel } from "../../../locale";
import MD from "../../../utils/md";
import { ExecuteCommandOptions, ExecuteCommandReturn } from "../../index.types";

type GetCommandHelpOptions = {
    commandName: string;
    options: ExecuteCommandOptions;
    ephemeral?: boolean;
}

const getCommandHelp = async ({ commandName, options, ephemeral }: GetCommandHelpOptions): ExecuteCommandReturn => {
    const commandFromAliases = DiscordBot.Command.AliasesCollection.get(commandName);
    const defaultCommand = DiscordBot.Command.Collection.get(commandFromAliases || commandName);
    if (defaultCommand) {
        const locale = await translateCommandToLocale(defaultCommand, options.locale.localeLabel as LocaleLabel);
        return { content: createGetHelp(locale.botCommand, options), type: 'embed', ephemeral };
    }
    return { content: options.locale.interaction.iDontKnowThisArgument, vars: { arg: MD.codeBlock.line(commandName) }, ephemeral };
}

export default getCommandHelp;