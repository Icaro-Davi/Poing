import { BotCommand } from "../../index.types";
import locale from '../../../locale/example.locale.json';
import argument, { getHowToUse } from "./command.args";
import execDefaultCommand from "./command.default";
import execSlashCommand from "./command.slash";

const command: BotCommand = {
    name: 'mute',
    howToUse: getHowToUse(),
    category: locale.category.moderation,
    description: locale.command.mute.description,
    allowedPermissions: ['MUTE_MEMBERS'],
    usage: [
        [argument.MEMBER, argument.ADD_ROLE, argument.LIST],
        [argument.TIME],
        [argument.REASON]
    ],
    slashCommand: [
        {
            ...argument.MEMBER,
            description: `\\[${locale.category.moderation}\\] ${argument.MEMBER.description}`,
            type: 'SUB_COMMAND',
            options: [
                { ...argument.TARGET_MEMBER, type: 'USER' },
                { ...argument.TIME, type: 'STRING' },
                { ...argument.REASON, type: 'STRING' }
            ]
        },
        {
            ...argument.ADD_ROLE,
            description: `\\[${locale.category.moderation}\\] ${argument.ADD_ROLE.description}`,
            type: 'SUB_COMMAND',
            options: [{ ...argument.TARGET_ROLE, type: 'ROLE' }]
        },
        {
            ...argument.LIST,
            description: `\\[${locale.category.moderation}\\] ${argument.LIST.description}`,
            type: 'SUB_COMMAND'
        },
    ],
    execSlash: execSlashCommand,
    execDefault: execDefaultCommand
}

export default command;