import { BotCommand } from "../../index.types";
import locale from '../../../locale/example.locale.json';
import argument, { getHowToUse } from "./command.args";
import slashCommand from "./command.slash";
import defaultCommand from "./command.default";

const command: BotCommand = {
    name: 'ban',
    category: locale.category.moderation,
    howToUse: getHowToUse(),
    description: locale.command.ban.description,
    allowedPermissions: ['BAN_MEMBERS'],
    usage: [
        [argument.MEMBER],
        [argument.DAYS],
        [argument.REASON]
    ],
    slashCommand: [
        { ...argument.MEMBER, type: 'USER' },
        { ...argument.DAYS, type: 'INTEGER', min_value: 1, max_value: 7 },
        { ...argument.REASON, type: 'STRING' },
    ],
    execSlash: slashCommand,
    execDefault: defaultCommand
}

export default command;