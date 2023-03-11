import { middleware } from "../../command.middleware";
import { extractVarsFromObject } from "../../command.utils";
import type { BotCommandFunc } from "../../index.types";
import argument, { argMiddleware } from "./command.args";
import commandMiddleware from "./command.default";
import slashCommandMiddleware from "./command.slash";

const command: BotCommandFunc = ({ locale }) => ({
    name: 'ban',
    category: locale.category.moderation,
    description: locale.command.ban.description,
    allowedPermissions: ['BAN_MEMBERS'],
    botPermissions: ['BAN_MEMBERS'],
    usage: [
        [
            argument.MEMBER({ locale, required: false }),
            argument.SOFT({ locale, required: true }),
            argument.LIST({ locale, required: true }),
        ],
        [
            argument.DAYS({ locale }),
            argument.MEMBER({ locale, required: true }),
        ],
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
            ...argument.SOFT({ locale }),
            type: 'SUB_COMMAND',
            description: `[${locale.category.moderation}] ${locale.command.ban.usage.soft_ban.description}`,
            options: [
                { ...argument.TARGET_MEMBER({ locale }), type: 'USER' }
            ]
        }
    ],
    commandPipeline: [
        argMiddleware[0], commandMiddleware,
        middleware.submitLog('COMMAND', context => ({
            status: true,
            subCommand: context.argument.subCommand
        })),
    ],
    slashCommandPipeline: [
        argMiddleware[1], slashCommandMiddleware,
        middleware.submitLog('COMMAND_INTERACTION', context => ({
            subCommand: context.argument.subCommand,
            status: false,
            userInput: extractVarsFromObject({
                reason: context.data.reason,
                days: context.data.days,
                target: context.data.banMember
            })
        })),
    ]
});

export default command;