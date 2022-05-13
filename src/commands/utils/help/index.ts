import { BotCommand } from "../../index.types";
import locale from '../../../locale/example.locale.json';
import argument, { getHowToUse } from "./command.args";
import execDefaultCommand from "./command.default";
import execSlashCommand from "./command.slash";
import { DiscordBot } from "../../../config";

const command: BotCommand = {
    name: 'help',
    category: locale.category.utility,
    howToUse: getHowToUse(),
    description: locale.command.help.description,
    aliases: ['h'],
    usage: [
        [argument.COMMAND, argument.LIST]
    ],
    slashCommand: [
        {
            ...argument.LIST,
            description: `\\[${locale.category.utility}\\] ${argument.LIST.description}`,
            type: 'SUB_COMMAND'
        },
        {
            ...argument.COMMAND,
            type: 'SUB_COMMAND',
            description: `\\[${locale.category.utility}\\] ${argument.COMMAND.description}`,
            options: [{
                ...argument.TARGET, type: 'STRING',
            }]
        }
    ],
    execSlash: execSlashCommand,
    execDefault: execDefaultCommand
}

DiscordBot.Command.onLoad((commands) => {
    const helpCommand = commands.get(command.name);
    const commandArg = helpCommand?.slashCommand?.find(arg => arg.name === argument.COMMAND.name) as any;
    if (commandArg) commandArg.options[0].choices = commands.map((_, key) => ({ name: key, value: key }));
});

export default command;