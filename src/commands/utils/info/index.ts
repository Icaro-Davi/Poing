import argument from './command.args';
import execDefault from './command.default';
import execSlash from './command.slash';

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
            type: 'SUB_COMMAND',
            options: [{ ...argument.TARGET_MEMBER(options), type: 'USER' }]
        }
    ],
    execSlash,
    execDefault
});

export default command;