import argument from "./command.args";
import execDefaultCommand from "./command.default";
import execSlashCommand from "./command.slash";

import type { BotCommandFunc } from "../../index.types";

const command: BotCommandFunc = (options) => ({
    name: 'mute',
    category: options.locale.category.moderation,
    description: options.locale.command.mute.description,
    allowedPermissions: ['MUTE_MEMBERS'],
    usage: [
        [
            argument.MEMBER({ locale: options.locale, required: true }),
            argument.ADD_ROLE({ locale: options.locale, required: true }),
            argument.LIST({ locale: options.locale, required: true })
        ],
        [argument.TIME(options)],
        [argument.REASON(options)]
    ],
    slashCommand: [
        {
            ...argument.MEMBER(options),
            description: `[${options.locale.category.moderation}] ${argument.MEMBER(options).description}`,
            type: 'SUB_COMMAND',
            options: [
                { ...argument.TARGET_MEMBER(options), type: 'USER' },
                { ...argument.TIME(options), type: 'STRING' },
                { ...argument.REASON(options), type: 'STRING' }
            ]
        },
        {
            ...argument.ADD_ROLE(options),
            description: `[${options.locale.category.moderation}] ${argument.ADD_ROLE(options).description}`,
            type: 'SUB_COMMAND',
            options: [{ ...argument.TARGET_ROLE(options), type: 'ROLE' }]
        },
        {
            ...argument.LIST(options),
            description: `[${options.locale.category.moderation}] ${argument.LIST(options).description}`,
            type: 'SUB_COMMAND'
        },
    ],
    execSlash: execSlashCommand,
    execDefault: execDefaultCommand
});

export default command;