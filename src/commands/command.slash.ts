import { BotApplication } from "../application";
import { DiscordBot } from "../config";

import type { CommandInteraction } from "discord.js";
import { isAllowedToUseThisCommand } from "./command.utils";

const execSlashCommand = async (interaction: CommandInteraction) => {
    try {
        const Command = DiscordBot.Command.Collection.get(interaction.commandName);
        if (!Command) return;

        const botConf = await BotApplication.getConfigurations(interaction.guildId!);

        const locale = DiscordBot.LocaleMemory.get(botConf.locale);
        const botCommand = Command({ locale });

        if (!botCommand || !botCommand.execSlash) return;

        if (await isAllowedToUseThisCommand({ interaction, allowedPermissions: botCommand.allowedPermissions, locale })) return;
        if (await isAllowedToUseThisCommand({ interaction, allowedPermissions: botCommand.botPermissions, locale, isBot: true })) return;

        const returnMessageOptions = await botCommand.execSlash(interaction, {
            locale,
            bot: {
                "@mention": `<@${DiscordBot.Bot.ID}>`,
                name: DiscordBot.Bot.name,
                hexColor: botConf.messageEmbedHexColor ?? DiscordBot.Bot.defaultBotHexColor,
                prefix: DiscordBot.Bot.defaultPrefix
            }
        });

        await DiscordBot.Command.handleMessage({
            ...returnMessageOptions,
            message: interaction,
            vars: {
                ...returnMessageOptions?.vars ? returnMessageOptions.vars : {},
                ...locale,
            }
        });
    } catch (error) {
        console.error(error);
    }
}

export default execSlashCommand;