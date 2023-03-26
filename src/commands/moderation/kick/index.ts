import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
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
    allowedPermissions: [PermissionFlagsBits.KickMembers],
    botPermissions: [PermissionFlagsBits.KickMembers],
    usage: [
        [argument.MEMBER({ locale, required: true }), argument.MASS({ locale })],
        [argument.REASON({ locale })]
    ],
    slashCommand: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            ...argument.MEMBER({ locale }),
            options: [
                { ...argument.TARGET_MEMBER({ locale }), type: ApplicationCommandOptionType.User },
                { ...argument.REASON({ locale }), type: ApplicationCommandOptionType.String },
            ]
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            ...argument.MASS({ locale }),
        }
    ],
    commandPipeline: [
        argMiddleware[0],
        middleware.DEVELOPMENT.logContext('COMMAND', true),
        commandMiddleware,
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