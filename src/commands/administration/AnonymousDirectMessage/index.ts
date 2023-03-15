import argument, { argMiddleware } from "./command.args";
import commandMiddleware from "./command.default";
import slashCommandMiddleware from "./command.slash";

import type { BotCommandFunc } from "../../index.types";
import { middleware } from "../../command.middleware";
import { extractVarsFromObject } from "../../command.utils";

const command: BotCommandFunc = ({ locale }) => ({
    name: 'anonymous-direct-message',
    category: locale.category.administration,
    aliases: ['adm'],
    description: locale.command.anonymousDirectMessage.description,
    allowedPermissions: ['ADMINISTRATOR'],
    botPermissions: ['SEND_MESSAGES'],
    usage: [
        [argument.MEMBER({ locale, required: true })],
        [argument.MESSAGE({ locale, required: true })]
    ],
    slashCommand: [
        { ...argument.MEMBER({ locale }), type: 'USER' },
        { ...argument.MESSAGE({ locale }), type: 'STRING' }
    ],
    commandPipeline: [
        argMiddleware[0], commandMiddleware,
        middleware.submitLog('COMMAND')
    ],
    slashCommandPipeline: [
        argMiddleware[1], slashCommandMiddleware,
        middleware.submitLog('COMMAND_INTERACTION', ctx => ({
            userInput: extractVarsFromObject(ctx.data)
        }))
    ]
});

export default command;