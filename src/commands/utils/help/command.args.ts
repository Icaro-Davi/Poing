import { BotArgument } from "../../index.types";
import locale from '../../../locale/example.locale.json';

const argument: Record<'COMMAND' | 'LIST' | 'TARGET', BotArgument> = {
    COMMAND: {
        name: 'command',
        required: false,
        description: `[${locale.category.utility}] ${locale.usage.argument.command.description}`,
        example: locale.command.help.usage.commandExample,
        filter(message, args, locale) {
            if (args[0] === 'list') return;
            return args[0];
        }
    },
    LIST: {
        name: 'list',
        required: false,
        description: `[${locale.category.utility}] ${locale.command.help.usage.list.description}`,
        example: locale.command.help.usage.list.example,
        filter(message, args, locale) {
            return args[0]?.toLocaleLowerCase() === 'list';
        }
    },
    TARGET: {
        name: 'target',
        required: true,
        description: locale.usage.argument.command.description
    }
}

export default argument;