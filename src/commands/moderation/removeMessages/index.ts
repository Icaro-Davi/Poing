import argument from "./command.args";
import execDefaultCommand from "./command.default";
import execSlashCommand from "./command.slash";

import type { BotCommandFunc } from "../../index.types";

const command: BotCommandFunc = (options) => ({
    name: 'remove-messages',
    category: options.locale.category.moderation,
    description: options.locale.command.removeMessages.description,
    aliases: ['rm'],
    allowedPermissions: ['MANAGE_MESSAGES'],
    usage: [
        [argument.QUANTITY({ locale: options.locale, required: true })]
    ],
    slashCommand: [
        { ...argument.QUANTITY(options), type: 'NUMBER' }
    ],
    execSlash: execSlashCommand,
    execDefault: execDefaultCommand,
});

export default command;