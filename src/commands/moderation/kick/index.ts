import execDefaultCommand from "./command.default";
import execSlashCommand from "./command.slash";
import argument from "./command.args";

import type { BotCommandFunc } from "../../index.types";

const command: BotCommandFunc = ({ locale }) => ({
    name: 'kick',
    category: locale.category.moderation,
    description: locale.command.kick.description,
    allowedPermissions: ['KICK_MEMBERS'],
    usage: [[argument.MEMBER({ locale, required: true })], [argument.REASON({ locale })]],
    slashCommand: [
        { ...argument.MEMBER({ locale }), type: 'USER' },
        { ...argument.REASON({ locale }), type: 'STRING' }
    ],
    execSlash: execSlashCommand,
    execDefault: execDefaultCommand
});

export default command;