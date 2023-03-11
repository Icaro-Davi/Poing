import ping from "./ping.func";

import { middleware } from "../../command.middleware";

const execSlashCommand = middleware.create('COMMAND_INTERACTION', async function (interaction, options, next) {
    await ping({ interaction, options, ephemeral: true });
    next();
});

export default execSlashCommand;