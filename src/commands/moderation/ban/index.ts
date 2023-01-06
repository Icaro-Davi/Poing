import argument from "./command.args";
import slashCommand from "./command.slash";
import defaultCommand from "./command.default";

import type { BotCommandFunc } from "../../index.types";

const command: BotCommandFunc = ({ locale }) => ({
    name: 'ban',
    category: locale.category.moderation,
    description: locale.command.ban.description,
    allowedPermissions: ['BAN_MEMBERS'],
    usage: [
        [argument.MEMBER({ locale, required: true }), argument.LIST({ locale, required: true })],
        [argument.DAYS({ locale })],
        [argument.REASON({ locale })]
    ],
    slashCommand: [
        {
            ...argument.MEMBER({ locale }),
            type: 'SUB_COMMAND',
            description: `[${locale.category.moderation}] ${locale.usage.argument.member.description}`,
            options: [
                { ...argument.TARGET_MEMBER({ locale }), type: 'USER' },
                { ...argument.DAYS({ locale }), type: 'NUMBER', min_value: 1, max_value: 7 },
                { ...argument.REASON({ locale }), type: 'STRING' }
            ]
        },
        {
            ...argument.LIST({ locale }),
            type: 'SUB_COMMAND',
            description: `[${locale.category.moderation}] ${locale.command.ban.usage.list.description}`
        },
        {
            ...argument.SOFT_BAN({ locale }),
            type: 'SUB_COMMAND',
            description: `[${locale.category.moderation}] ${locale.command.ban.usage.soft_ban.description}`,
            options: [
                { ...argument.TARGET_MEMBER({ locale }), type: 'USER' }
            ]
        }
    ],
    execSlash: slashCommand,
    execDefault: defaultCommand
});

export default command;