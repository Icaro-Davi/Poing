import { BotApplication } from "../application";
import { DiscordBot } from "../config";

import type { CommandInteraction } from "discord.js";
import { isAllowedToUseThisCommand } from "./command.utils";
import { ExecuteCommandOptions } from "./index.types";

const execSlashCommand = async (interaction: CommandInteraction) => {
    try {
        const Command = DiscordBot.Command.Collection.get(interaction.commandName);
        if (!Command) return;

        const { locale: localeLang, messageEmbedHexColor, channel } = await BotApplication.getConfigurations(interaction.guildId!);

        const locale = DiscordBot.LocaleMemory.get(localeLang);
        const botCommand = Command({ locale });

        if (!botCommand || !botCommand.execSlash) return;

        if (await isAllowedToUseThisCommand({ interaction, allowedPermissions: botCommand.allowedPermissions, locale })) return;
        if (await isAllowedToUseThisCommand({ interaction, allowedPermissions: botCommand.botPermissions, locale, isBot: true })) return;

        const options: ExecuteCommandOptions = {
            locale,
            bot: {
                // channel: { logsId: '1057080188216823818' },
                channel: channel,
                "@mention": `<@${DiscordBot.Bot.ID}>`,
                name: DiscordBot.Bot.name,
                hexColor: messageEmbedHexColor ?? DiscordBot.Bot.defaultBotHexColor,
                prefix: DiscordBot.Bot.defaultPrefix
            },
            context: { data: {}, argument: {} },
        }

        const returnMessageOptions = await botCommand.execSlash(interaction, options);

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