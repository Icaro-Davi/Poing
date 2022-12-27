import { DiscordBot } from '../config';
import handleError from '../utils/handleError';
import getCommand from '../commands/command.default';

import type { Message } from 'discord.js';

export const eventMessageCreate = async (message: Message) => {
    const Command = await getCommand(message);

    try {
        if (!Command) return;
        const { args, command, options } = Command;

        const returnMessageOptions = await command?.execDefault(message, args, options);

        await DiscordBot.Command.handleMessage({
            ...returnMessageOptions, message,
            vars: {
                ...returnMessageOptions?.vars ? returnMessageOptions.vars : {},
                ...options,
            }
        });

    } catch (error) {
        Command?.options.locale ? handleError(error, {
            errorLocale: 'event/messageCreate',
            locale: Command.options.locale,
            message: message
        }) : console.error(error);
    }
}

export default () => DiscordBot.Client.on('messageCreate', eventMessageCreate);