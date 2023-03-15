import argument, { argMiddleware } from "./command.args";
import commandMiddleware from "./command.default";
import slashCommandMiddleware from "./command.slash";
import type { BotCommandFunc } from "../../index.types";
import { middleware } from "../../command.middleware";
import { extractVarsFromObject } from "../../command.utils";

const command: BotCommandFunc = (options) => ({
    name: 'unban',
    category: options.locale.category.moderation,
    description: options.locale.command.unban.description,
    allowedPermissions: ['BAN_MEMBERS'],
    botPermissions: ['BAN_MEMBERS'],
    usage: [
        [argument.MEMBER({ locale: options.locale, required: true })],
        [argument.REASON(options)]
    ],
    slashCommand: [
        { ...argument.MEMBER(options), type: 'NUMBER' },
        { ...argument.REASON(options), type: 'STRING' }
    ],
    commandPipeline: [
        argMiddleware[0], commandMiddleware,
        middleware.submitLog('COMMAND')
    ],
    slashCommandPipeline: [
        argMiddleware[1], slashCommandMiddleware,
        middleware.submitLog('COMMAND_INTERACTION', ctx => ({
            userInput: extractVarsFromObject({ ...ctx.data })
        }))
    ]
});

export default command;