import getMembersStatus from "./getMembersStatus.func";

import type { ExecuteSlashCommand } from "../../index.types";

const execSlashCommand: ExecuteSlashCommand = async function (interaction, options) {
    if (!interaction.guild) return;

    const answer = await getMembersStatus(interaction.guild, options);
    return { content: answer, type: 'embed', ephemeral: true };
}

export default execSlashCommand;