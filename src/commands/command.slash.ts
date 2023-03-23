import { BotApplication } from "../application";
import { DiscordBot } from "../config";

import type { ChatInputCommandInteraction } from "discord.js";
import { isAllowedToUseThisCommand } from "./command.utils";
import { ExecuteCommandOptions } from "./index.types";
import createPipeline from "./command.middleware";
import HexColorToNumber from "../utils/HexColorToNumber";

const execSlashCommand = async (interaction: ChatInputCommandInteraction) => {
    try {
        const Command = DiscordBot.Command.Collection.get(interaction.commandName);
        if (!Command) return;

        const { locale: localeLang, messageEmbedHexColor, channel } = await BotApplication.getConfigurations(interaction.guildId!);
        const locale = DiscordBot.LocaleMemory.get(localeLang);
        const botCommand = Command({ locale });

        if (!botCommand) return;

        if (await isAllowedToUseThisCommand({ interaction, allowedPermissions: botCommand.allowedPermissions, locale })) return;
        if (await isAllowedToUseThisCommand({ interaction, allowedPermissions: botCommand.botPermissions, locale, isBot: true })) return;
        const options: ExecuteCommandOptions = {
            locale,
            bot: {
                channel: channel,
                "@mention": `<@${DiscordBot.Bot.ID}>`,
                name: DiscordBot.Bot.name,
                hexColor: HexColorToNumber(messageEmbedHexColor ?? DiscordBot.Bot.defaultBotHexColor),
                prefix: DiscordBot.Bot.defaultPrefix
            },
            context: { data: {}, argument: {} },
        }

        if (botCommand.slashCommandPipeline) {
            const runPipeline = createPipeline('COMMAND_INTERACTION', botCommand.slashCommandPipeline)
            return runPipeline.call(botCommand, interaction, options);
        }
    } catch (error) {
        console.error(error);
    }
}

export default execSlashCommand;