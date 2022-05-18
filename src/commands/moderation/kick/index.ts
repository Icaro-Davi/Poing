import { BotCommand } from "../../index.types";
import locale from '../../../locale/example.locale.json';
import execDefaultCommand from "./command.default";
import execSlashCommand from "./command.slash";
import argument, { getHowToUse } from "./command.args";

const command: BotCommand = {
    name: 'kick',
    howToUse: getHowToUse(),
    category: locale.category.moderation,
    description: locale.command.kick.description,
    allowedPermissions: ['KICK_MEMBERS'],
    usage: [[argument.MEMBER], [argument.REASON]],
    slashCommand: [
        { ...argument.MEMBER, type: 'USER' },
        { ...argument.REASON, type: 'STRING' }
    ],
    execSlash: execSlashCommand,
    execDefault: execDefaultCommand
};

export default command;