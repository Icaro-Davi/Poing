import { Message } from 'discord.js';

import { DiscordBot } from '../config';
import handleError from '../utils/handleError';
import getCommand from '../commands/command.default';

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
        console.log(error);
        Command?.options.locale ? handleError(error, {
            errorLocale: 'event/messageCreate',
            locale: Command.options.locale,
            message: message
        }) : console.error(error);
    }
}

export default () => DiscordBot.Client.get().on('messageCreate', eventMessageCreate);