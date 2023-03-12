import argument, { argMiddleware } from "./command.args";
import commandMiddleware from "./command.default";
import slashCommandMiddleware from "./command.slash";

import { middleware } from "../../command.middleware";
import { extractVarsFromObject } from "../../command.utils";
import type { BotCommandFunc } from "../../index.types";

const command: BotCommandFunc = (options) => ({
    name: 'mute',
    category: options.locale.category.moderation,
    description: options.locale.command.mute.description,
    allowedPermissions: ['MUTE_MEMBERS'],
    botPermissions: ['MANAGE_ROLES', 'MUTE_MEMBERS'],
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
    commandPipeline: [
        argMiddleware[0], commandMiddleware,
        middleware.submitLog('COMMAND', ctx => ({ subCommand: ctx.argument.subCommand }))
    ],
    slashCommandPipeline: [
        argMiddleware[1], slashCommandMiddleware,
        middleware.submitLog('COMMAND_INTERACTION', ctx => ({ subCommand: ctx.argument.subCommand, userInput: extractVarsFromObject({ ...ctx.data }) }))
    ]
});

export default command;