import { middleware } from "../../command.middleware";
import { extractVarsFromObject } from "../../command.utils";
import type { BotCommandFunc } from "../../index.types";
import argument, { argMiddleware } from "./command.args";
import commandMiddleware from "./command.default";
import slashCommandMiddleware from "./command.slash";

const command: BotCommandFunc = ({ locale }) => ({
    name: 'kick',
    category: locale.category.moderation,
    description: locale.command.kick.description,
    allowedPermissions: ['KICK_MEMBERS'],
    botPermissions: ['KICK_MEMBERS'],
    usage: [[argument.MEMBER({ locale, required: true })], [argument.REASON({ locale })]],
    slashCommand: [
        { ...argument.MEMBER({ locale }), type: 'USER' },
        { ...argument.REASON({ locale }), type: 'STRING' }
    ],
    commandPipeline: [
        argMiddleware[0], commandMiddleware,
        middleware.submitLog('COMMAND', context => ({
            status: context.argument.kicked
        }))
    ],
    slashCommandPipeline: [
        argMiddleware[1], slashCommandMiddleware,
        middleware.submitLog('COMMAND_INTERACTION', context => ({
            status: context.argument.kicked,
            userInput: extractVarsFromObject({ member: context.data.kickedMember, reason: context.data.reason })
        }))
    ]
});

export default command;