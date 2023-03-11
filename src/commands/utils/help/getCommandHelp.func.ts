import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { createGetHelp } from "../../../components/messageEmbed";
import { DiscordBot } from "../../../config";
import MD from "../../../utils/md";

import type { ExecuteCommandOptions } from "../../index.types";

type GetCommandHelpOptions = {
    commandName: string;
    options: ExecuteCommandOptions;
    ephemeral?: boolean;
    onFinish: (params: { embed: MessageEmbed, button: MessageActionRow }) => void,
    onError: (message: string) => void
}

const getCommandHelp = async ({ commandName, options, onFinish, onError }: GetCommandHelpOptions) => {
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
        await onFinish({ embed: createGetHelp(botCommand, options), button: row }); return;
    }
    await onError(`${options.locale.interaction.iDontKnowThisArgument} [${MD.codeBlock.line(commandName)}]`);
}

export default getCommandHelp;