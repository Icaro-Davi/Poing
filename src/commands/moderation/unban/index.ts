import argument, { argMiddleware } from "./command.args";
import commandMiddleware from "./command.default";
import slashCommandMiddleware from "./command.slash";
import type { BotCommandFunc } from "../../index.types";
import { middleware } from "../../command.middleware";
import { extractVarsFromObject } from "../../command.utils";
import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";

const command: BotCommandFunc = (options) => ({
    name: 'unban',
    category: options.locale.category.moderation,
    description: options.locale.command.unban.description,
    allowedPermissions: [PermissionFlagsBits.BanMembers],
    botPermissions: [PermissionFlagsBits.BanMembers],
    usage: [
        [argument.MEMBER({ locale: options.locale, required: true })],
        [argument.REASON(options)]
    ],
    slashCommand: [
        { ...argument.MEMBER(options), type: ApplicationCommandOptionType.Number },
        { ...argument.REASON(options), type: ApplicationCommandOptionType.String }
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