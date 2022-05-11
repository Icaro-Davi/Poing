import { BotCommand } from "../../index.types";
import locale from '../../../locale/example.locale.json';
import { argument } from "./command.args";
import commandSlash from "./command.slash";
import commandDefault from "./command.default";

const command: BotCommand = {
    name: 'anonymous-direct-message',
    category: locale.category.administration,
    aliases: ['adm'],
    description: locale.command.anonymousDirectMessage.description,
    allowedPermissions: ['ADMINISTRATOR'],
    usage: [
        [argument.MEMBER],
        [argument.MESSAGE]
    ],
    slashCommand: [
        { ...argument.MEMBER, type: 'USER' },
        { ...argument.MESSAGE, type: 'STRING' }
    ],
    execSlash: commandSlash,
    execDefault: commandDefault
}

export default command;