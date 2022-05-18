import { BotCommand } from "../../index.types";
import locale from '../../../locale/example.locale.json';
import argument, { getHowToUse } from "./command.args";
import execDefaultCommand from "./command.default";
import execSlashCommand from "./command.slash";

const command: BotCommand = {
    name: 'unban',
    howToUse: getHowToUse(),
    category: locale.category.moderation,
    description: locale.command.unban.description,
    allowedPermissions: ['BAN_MEMBERS'],
    usage: [
        [argument.MEMBER],
        [argument.REASON]
    ],
    slashCommand: [
        { ...argument.MEMBER, type: 'NUMBER' },
        { ...argument.REASON, type: 'STRING' }
    ],
    execSlash: execSlashCommand,
    execDefault: execDefaultCommand
}

export default command;