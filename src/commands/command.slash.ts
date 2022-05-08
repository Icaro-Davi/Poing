import { CommandInteraction } from "discord.js";
import Guild from "../application/Guild";
import { DiscordBot } from "../config";
import { getInitialLocaleVars } from "../locale";

const execSlashCommand = async (interaction: CommandInteraction) => {
    try {
        const defaultCommand = DiscordBot.Command.Collection.get(interaction.commandName);
        if (!defaultCommand || !defaultCommand.execSlash) return;

        const guildDoc = await Guild.findById(interaction.guildId!);
        const vars = await getInitialLocaleVars({ locale: guildDoc?.bot.locale || 'en-US' });

        const returnMessageOptions = await defaultCommand.execSlash(interaction, {
            locale: vars.locale!,
            bot: {
                ...vars.bot,
                hexColor: guildDoc?.bot.messageEmbedHexColor ?? vars.bot.hexColor
            }
        });

        await DiscordBot.Command.handleMessage({
            ...returnMessageOptions,
            message: interaction,
            vars: {
                ...returnMessageOptions?.vars ? returnMessageOptions.vars : {},
                ...vars,
            }
        });
    } catch (error) {
        console.error(error);
    }
}

export default execSlashCommand;