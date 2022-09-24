import argument from "./command.args";
import execDefaultCommand from "./command.default";
import execSlashCommand from "./command.slash";
import { DiscordBot } from "../../../config";

import type { BotCommandFunc } from "../../index.types";

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
            type: 'SUB_COMMAND'
        },
        {
            ...argument.COMMAND(options),
            type: 'SUB_COMMAND',
            description: `[${options.locale.category.utility}] ${argument.COMMAND(options).description}`,
            options: [{
                ...argument.TARGET(options), type: 'STRING',
            }]
        }
    ],
    execSlash: execSlashCommand,
    execDefault: execDefaultCommand
});

DiscordBot.Command.onLoad((commands) => {
    const helpCommand = commands.get(command.name);
    const commandArg = helpCommand?.slashCommand?.find(arg => arg.name === argument.COMMAND.name) as any;
    if (commandArg) commandArg.options[0].choices = commands.map((_, key) => ({ name: key, value: key }));
});

export default command;