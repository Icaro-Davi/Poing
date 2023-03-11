import execDefault from "./command.default";
import execSlash from "./command.slash";

import type { BotCommandFunc } from "../../index.types";
import { middleware } from "../../command.middleware";

const command: BotCommandFunc = ({ locale }) => ({
    name: 'ping',
    category: locale.category.utility,
    description: locale.command.ping.description,
    aliases: ['p'],
    commandPipeline: [execDefault, middleware.submitLog('COMMAND')],
    slashCommandPipeline: [execSlash, middleware.submitLog('COMMAND_INTERACTION')],
});

export default command;

