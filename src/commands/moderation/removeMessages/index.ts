import argument, { argMiddleware } from "./command.args";
import commandMiddleware from "./command.default";
import slashCommandMiddleware from "./command.slash";

import type { BotCommandFunc } from "../../index.types";
import { middleware } from "../../command.middleware";
import { extractVarsFromObject } from "../../command.utils";
import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";

const command: BotCommandFunc = (options) => ({
    name: 'remove-messages',
    category: options.locale.category.moderation,
    description: options.locale.command.removeMessages.description,
    aliases: ['rm'],
    allowedPermissions: [PermissionFlagsBits.ManageMessages],
    botPermissions: [PermissionFlagsBits.ManageMessages],
    usage: [
        [argument.QUANTITY({ locale: options.locale, required: true })]
    ],
    slashCommand: [
        { ...argument.QUANTITY(options), type: ApplicationCommandOptionType.Number }
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