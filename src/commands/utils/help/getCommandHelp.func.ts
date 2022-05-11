import { createGetHelp } from "../../../components/messageEmbed";
import { DiscordBot } from "../../../config";
import translateCommandToLocale, { LocaleLabel } from "../../../locale";
import MD from "../../../utils/md";
import { ExecuteCommandOptions, ExecuteCommandReturn } from "../../index.types";

const getCommandHelp = async (arg: string, options: ExecuteCommandOptions): ExecuteCommandReturn => {
    const commandFromAliases = DiscordBot.Command.AliasesCollection.get(arg);
    const defaultCommand = DiscordBot.Command.Collection.get(commandFromAliases || arg);
    if (defaultCommand) {
        const locale = await translateCommandToLocale(defaultCommand, options.locale.localeLabel as LocaleLabel);
        return { content: createGetHelp(locale.botCommand, options), type: 'embed' };
    }
    return { content: options.locale.interaction.iDontKnowThisArgument, vars: { arg: MD.codeBlock.line(arg) } };
}

export default getCommandHelp;