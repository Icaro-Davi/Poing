import argument from "./command.args";
import commandSlash from "./command.slash";
import commandDefault from "./command.default";

import type { BotCommandFunc } from "../../index.types";

const command: BotCommandFunc = ({ locale }) => ({
    name: 'anonymous-direct-message',
    category: locale.category.administration,
    aliases: ['adm'],
    description: locale.command.anonymousDirectMessage.description,
    allowedPermissions: ['ADMINISTRATOR'],
    usage: [
        [argument.MEMBER({ locale, required: true })],
        [argument.MESSAGE({ locale, required: true })]
    ],
    slashCommand: [
        { ...argument.MEMBER({ locale }), type: 'USER' },
        { ...argument.MESSAGE({ locale }), type: 'STRING' }
    ],
    execSlash: commandSlash,
    execDefault: commandDefault
});

export default command;