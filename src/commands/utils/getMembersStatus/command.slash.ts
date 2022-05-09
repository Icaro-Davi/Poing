import { ExecuteSlashCommand } from "../../index.types";
import getMembersStatus from "./getMembersStatus.func";

const execSlashCommand: ExecuteSlashCommand = async (interaction, options) => {
    if (!interaction.guild) return;

    const answer = await getMembersStatus(interaction.guild, options);
    return { content: answer, type: 'embed', ephemeral: true };
}

export default execSlashCommand;