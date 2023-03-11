import { DiscordBot } from '../config';
import handleError from '../utils/handleError';
import getCommand from '../commands/command.default';
import createPipeline from '../commands/command.middleware';

import type { Message } from 'discord.js';
import { createNewModule } from '.';

const textCommands = async (message: Message) => {
    const Command = await getCommand(message);
    try {
        if (!Command) return;
        const { args, command, options } = Command;
        if (command.commandPipeline) {
            const runPipeline = await createPipeline('COMMAND', command.commandPipeline);
            await runPipeline.call(command, message, args, options);
        } else {
            const returnMessageOptions = await command?.execDefault?.(message, args, options);
            if (returnMessageOptions)
                await DiscordBot.Command.handleMessage({
                    ...returnMessageOptions, message,
                    vars: {
                        ...returnMessageOptions?.vars ? returnMessageOptions.vars : {},
                        ...options,
                    }
                });
        }
    } catch (error) {
        Command?.options.locale ? handleError(error, {
            errorLocale: 'event/messageCreate',
            locale: Command.options.locale,
            message: message
        }) : console.error(error);
    }
}

export default createNewModule('messageCreate', textCommands);