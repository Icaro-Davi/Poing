import execDefault from "./command.default";
import execSlash from "./command.slash";

import type { BotCommandFunc } from "../../index.types";

const command: BotCommandFunc = ({ locale }) => ({
    name: 'ping',
    category: locale.category.utility,
    description: locale.command.ping.description,
    aliases: ['p'],
    execSlash,
    execDefault
});

export default command;

