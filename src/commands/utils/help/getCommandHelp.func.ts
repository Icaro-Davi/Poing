import { MessageActionRow, MessageButton } from 'discord.js';
import { createGetHelp } from "../../../components/messageEmbed";
import { DiscordBot } from "../../../config";
import MD from "../../../utils/md";

import type { ExecuteCommandOptions, ExecuteCommandReturn } from "../../index.types";

type GetCommandHelpOptions = {
    commandName: string;
    options: ExecuteCommandOptions;
    ephemeral?: boolean;
}

const getCommandHelp = async ({ commandName, options, ephemeral }: GetCommandHelpOptions): ExecuteCommandReturn => {
    const commandFromAliases = DiscordBot.Command.AliasesCollection.get(commandName);
    const defaultCommand = DiscordBot.Command.Collection.get(commandFromAliases || commandName);
    if (defaultCommand) {
        const botCommand = defaultCommand({ locale: options.locale });
        const row = new MessageActionRow().addComponents([
            new MessageButton()
                .setLabel(options.locale.messageActionRow.getHelpButton)
                .setStyle('LINK')
                .setURL(`${DiscordBot.Bot.urlWebApp}/${options.locale.localeLabel}/commands?category=${botCommand.category}&command=${botCommand.name}`)
        ]);
        return { content: createGetHelp(botCommand, options), type: 'embed', ephemeral, components: [row] };
    }
    return { content: options.locale.interaction.iDontKnowThisArgument, vars: { arg: MD.codeBlock.line(commandName) }, ephemeral };
}

export default getCommandHelp;