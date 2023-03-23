import { BotCommandFunc } from "../../index.types";
import commandMiddleware from "./command.default";
import slashCommandMiddleware from "./command.slash";
import argument, { argsMiddleware } from "./command.args";
import { middleware } from "../../command.middleware";
import { PermissionFlagsBits } from "discord.js";

const command: BotCommandFunc = options => ({
    name: 'embed',
    category: options.locale.category.utility,
    description: options.locale.command.embed.description,
    botPermissions: [PermissionFlagsBits.SendMessages],
    usage: [
        [
            { ...argument.FLAGS({ ...options, required: true }) }
        ]
    ],
    commandPipeline: [argsMiddleware[0], commandMiddleware, middleware.submitLog('COMMAND', context => ({ embedMessage: context.argument.embed }))],
    slashCommandPipeline: [slashCommandMiddleware, middleware.submitLog('COMMAND_INTERACTION', context => ({ embedMessage: context.argument.embed }))]
});

export default command;