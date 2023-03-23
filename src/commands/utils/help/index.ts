import { ApplicationCommandOptionType } from "discord.js";
import { DiscordBot } from "../../../config";
import { middleware } from "../../command.middleware";
import { extractVarsFromObject } from "../../command.utils";
import type { BotCommandFunc } from "../../index.types";
import argument, { argsMiddleware } from "./command.args";
import commandMiddleware from "./command.default";
import slashCommandMiddleware from "./command.slash";

const command: BotCommandFunc = (options) => ({
    name: 'help',
    category: options.locale.category.utility,
    description: options.locale.command.help.description,
    aliases: ['h'],
    usage: [
        [argument.COMMAND(options), argument.LIST(options)]
    ],
    slashCommand: [
        {
            ...argument.LIST(options),
            description: `[${options.locale.category.utility}] ${argument.LIST(options).description}`,
            type: ApplicationCommandOptionType.Subcommand
        },
        {
            ...argument.COMMAND(options),
            type: ApplicationCommandOptionType.Subcommand,
            description: `[${options.locale.category.utility}] ${argument.COMMAND(options).description}`,
            options: [{
                ...argument.TARGET(options), type: ApplicationCommandOptionType.String,
            }]
        }
    ],
    commandPipeline: [
        argsMiddleware[0], commandMiddleware,
        middleware.submitLog('COMMAND', data => ({ subCommand: data.argument.subCommand }))
    ],
    slashCommandPipeline: [
        argsMiddleware[1], slashCommandMiddleware,
        middleware.submitLog('COMMAND_INTERACTION', data => ({
            subCommand: data.argument.subCommand,
            userInput: extractVarsFromObject({  command: data.data.commandName  })
        }))
    ]
});

DiscordBot.Command.onLoad((commands) => {
    const helpCommand = commands.get(command.name);
    const commandArg = helpCommand?.slashCommand?.find(arg => arg.name === argument.COMMAND.name) as any;
    if (commandArg) commandArg.options[0].choices = commands.map((_, key) => ({ name: key, value: key }));
});

export default command;