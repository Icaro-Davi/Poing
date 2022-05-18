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
        [argument.MEMBER, argument.LIST],
        [argument.DAYS],
        [argument.REASON]
    ],
    slashCommand: [
        {
            ...argument.MEMBER,
            type: 'SUB_COMMAND',
            description: `\\[${locale.category.moderation}\\] ${argument.MEMBER.description}`,
            options: [
                { ...argument.TARGET_MEMBER, type: 'USER' },
                { ...argument.DAYS, type: 'NUMBER', min_value: 1, max_value: 7 },
                { ...argument.REASON, type: 'STRING' }
            ]
        },
        {
            ...argument.LIST,
            type: 'SUB_COMMAND',
            description: `\\[${locale.category.moderation}\\] ${argument.LIST.description}`
        }
    ],
    execSlash: slashCommand,
    execDefault: defaultCommand
}

export default command;