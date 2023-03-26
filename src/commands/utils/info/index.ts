import { middleware } from '../../command.middleware';
import { extractVarsFromObject } from '../../command.utils';
import argument, { argsMiddleware } from './command.args';
import commandDefaultMiddleware from './command.default';
import slashCommandMiddleware from './command.slash';

import { ApplicationCommandOptionType } from 'discord.js';
import type { BotCommandFunc } from '../../index.types';

const command: BotCommandFunc = (options) => ({
    name: 'info',
    category: options.locale.category.utility,
    description: options.locale?.command.info.description,
    usage: [
        [argument.MEMBER({ locale: options.locale, required: true })],
    ],
    slashCommand: [
        {
            ...argument.MEMBER(options),
            description: `[${options.locale.category.utility}] ${argument.MEMBER(options).description}`,
            type: ApplicationCommandOptionType.Subcommand,
            options: [{ ...argument.TARGET_MEMBER(options), type: ApplicationCommandOptionType.User }],
        }
    ],
    commandPipeline: [argsMiddleware[0], commandDefaultMiddleware, middleware.submitLog('COMMAND', context => ({ subCommand: context.argument.subCommand }))],
    slashCommandPipeline: [argsMiddleware[1], slashCommandMiddleware, middleware.submitLog('COMMAND_INTERACTION', context => ({
        subCommand: context.argument.subCommand,
        userInput: extractVarsFromObject({ ...context.data })
    }))]
});

export default command;