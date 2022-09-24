import argument from "./command.args";
import execDefaultCommand from "./command.default";
import execSlashCommand from "./command.slash";

import type { BotCommandFunc } from "../../index.types";

const command: BotCommandFunc = (options) => ({
    name: 'unban',
    category: options.locale.category.moderation,
    description: options.locale.command.unban.description,
    allowedPermissions: ['BAN_MEMBERS'],
    usage: [
        [argument.MEMBER({ locale: options.locale, required: true })],
        [argument.REASON(options)]
    ],
    slashCommand: [
        { ...argument.MEMBER(options), type: 'NUMBER' },
        { ...argument.REASON(options), type: 'STRING' }
    ],
    execSlash: execSlashCommand,
    execDefault: execDefaultCommand
});

export default command;