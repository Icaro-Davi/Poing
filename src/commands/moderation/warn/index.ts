import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import { middleware } from "../../command.middleware";
import { extractVarsFromObject } from "../../command.utils";
import { BotCommandFunc } from "../../index.types";
import argument, { getArgs } from "./command.args";
import execCommandDefault from "./command.default";
import execCommandSlash from "./command.slash";

const argsMiddleware = getArgs();

const command: BotCommandFunc = options => ({
    name: 'warn',
    category: options.locale.category.moderation,
    description: options.locale.command.warn.description,
    allowedPermissions: [PermissionFlagsBits.ModerateMembers],
    botPermissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewAuditLog],
    usage: [
        [
            argument.MESSAGE({ ...options, required: true }),
            argument.EMBED({ ...options, required: true })
        ],
        [
            argument.MEMBER({ ...options, required: true })
        ]
    ],
    slashCommand: [
        {
            ...argument.MESSAGE(options),
            type: ApplicationCommandOptionType.Subcommand,
            description: `[${options.locale.category.moderation}] ${argument.MESSAGE(options).description}`,
            options: [
                { ...argument.MEMBER({ ...options, required: true }), type: ApplicationCommandOptionType.User },
                { ...argument.MESSAGE({ ...options, required: true }), type: ApplicationCommandOptionType.String },
            ]
        },
        {
            ...argument.EMBED(options),
            type: ApplicationCommandOptionType.Subcommand,
            description: `[${options.locale.category.moderation}] ${argument.EMBED(options).description}`,
            options: [{ ...argument.MEMBER({ ...options, required: true }), type: ApplicationCommandOptionType.User }]
        }
    ],
    commandPipeline: [
        argsMiddleware[0], execCommandDefault,
        middleware.submitLog('COMMAND', (context) => ({ subCommand: context.argument.subCommand }))
    ],
    slashCommandPipeline: [
        argsMiddleware[1], execCommandSlash,
        middleware.submitLog('COMMAND_INTERACTION', (context) => ({
            subCommand: context.argument.subCommand,
            userInput: extractVarsFromObject(context.argument.userInput),
            ...context.argument.embedMessage ? { embedMessage: context.argument.embedMessage } : {}
        }))
    ]
});

export default command;