import { BotCommand } from "../../index.types";
import locale from '../../../locale/example.locale.json';
import argument, { getHowToUse } from "./command.args";
import execDefaultCommand from "./command.default";
import execSlashCommand from "./command.slash";

const command: BotCommand = {
    name: 'remove-messages',
    howToUse: getHowToUse(),
    category: locale.category.moderation,
    description: locale.command.removeMessages.description,
    aliases: ['rm'],
    allowedPermissions: ['MANAGE_MESSAGES'],
    usage: [
        [argument.QUANTITY]
    ],
    slashCommand: [
        { ...argument.QUANTITY, type: 'NUMBER' }
    ],
    execSlash: execSlashCommand,
    execDefault: execDefaultCommand,
}

export default command;