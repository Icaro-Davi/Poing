import DiscordJS, { Message } from 'discord.js';
import { GetCommandPaths } from '../utils/GetCommandPaths';

export const GetAllClientCommands = () => {
    const clientCommands = new DiscordJS.Collection<string, BotCommand>();
    const commandPaths = GetCommandPaths('./src/commands', '../');    
    for (const path of commandPaths) {
        const command = require(path).default as BotCommand;
        clientCommands.set(command.name, command);
    }
    return clientCommands;
}

export type ExecuteCommand = (message: Message, args: string[]) => void;
export type BotCommand = { name: string, description: string, exec: ExecuteCommand };
// export type BotCommand = keyof typeof botCommands.command;
// export type BotCommandHelp = keyof typeof botCommands.help;
// export default botCommands;