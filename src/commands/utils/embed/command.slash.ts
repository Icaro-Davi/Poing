import { ExecuteSlashCommand } from "../../index.types";
import CreateEmbedCollectorData from "./createEmbedCollectorData.func";

const execCommandSlash: ExecuteSlashCommand = async (interaction, options) => {
    await CreateEmbedCollectorData({ interaction, options });
}

export default execCommandSlash;