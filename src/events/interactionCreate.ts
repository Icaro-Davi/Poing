import { Interaction } from "discord.js";
import execSlashCommand from "../commands/command.slash";
import { DiscordBot } from "../config/";

const onInteractionCreate = async (interaction: Interaction) => {
    if (interaction.user.bot) return;
    if (interaction.isCommand()) {
        await execSlashCommand(interaction);
    }
}

export default () => DiscordBot.Client.get().on('interactionCreate', onInteractionCreate);