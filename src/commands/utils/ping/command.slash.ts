import ping from "./ping.func";

import type { ExecuteSlashCommand } from "../../index.types";

const execSlashCommand: ExecuteSlashCommand = async function (interaction, options) {
    await ping({ interaction, options, ephemeral: true });
}

export default execSlashCommand;