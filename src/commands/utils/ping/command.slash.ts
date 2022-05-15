import { ExecuteSlashCommand } from "../../index.types";
import ping from "./ping.func";

const execSlashCommand: ExecuteSlashCommand = async (interaction, options) => {
    await ping({ interaction, options, ephemeral: true });
}

export default execSlashCommand;