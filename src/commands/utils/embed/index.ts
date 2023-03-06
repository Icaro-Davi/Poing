import { BotCommandFunc } from "../../index.types";
import execCommandDefault from "./command.default";
import execCommandSlash from "./command.slash";
import argument from "./command.args";

const command: BotCommandFunc = options => ({
    name: 'embed',
    category: options.locale.category.utility,
    description: options.locale.command.embed.description,
    botPermissions: ['SEND_MESSAGES'],
    usage: [
        [
            { ...argument.FLAGS({ ...options, required: true }) }
        ]
    ],
    execDefault: execCommandDefault,
    execSlash: execCommandSlash,
});

export default command;