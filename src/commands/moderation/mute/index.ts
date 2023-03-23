import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
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
    allowedPermissions: [PermissionFlagsBits.MuteMembers],
    botPermissions: [PermissionFlagsBits.ManageRoles, PermissionFlagsBits.MuteMembers],
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
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                { ...argument.TARGET_MEMBER(options), type: ApplicationCommandOptionType.User },
                { ...argument.TIME(options), type: ApplicationCommandOptionType.String },
                { ...argument.REASON(options), type: ApplicationCommandOptionType.String }
            ]
        },
        {
            ...argument.ADD_ROLE(options),
            description: `[${options.locale.category.moderation}] ${argument.ADD_ROLE(options).description}`,
            type: ApplicationCommandOptionType.Subcommand,
            options: [{ ...argument.TARGET_ROLE(options), type: ApplicationCommandOptionType.Role }]
        },
        {
            ...argument.LIST(options),
            description: `[${options.locale.category.moderation}] ${argument.LIST(options).description}`,
            type: ApplicationCommandOptionType.Subcommand
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