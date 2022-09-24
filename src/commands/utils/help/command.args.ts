import { createFilter } from "../../argument.utils";

import type { BotArgumentFunc } from "../../index.types";

const argument: Record<'COMMAND' | 'LIST' | 'TARGET', BotArgumentFunc> = {
    COMMAND: (options) => ({
        name: 'command',
        required: false,
        description: options.locale.usage.argument.command.description,
        filter: createFilter(options, function (message, args) {
            if (args[0] === argument.LIST(options).name) return;
            return args[0];
        })
    }),
    LIST: (options) => ({
        name: 'list',
        required: false,
        description: options.locale.command.help.usage.list.description,
        example: options.locale.command.help.usage.list.example,
        filter: createFilter(options, function (message, args) {
            return args[0]?.toLocaleLowerCase() === 'list';
        })
    }),
    TARGET: (options) => ({
        name: 'target',
        required: true,
        description: options.locale.usage.argument.command.description
    })
}

export default argument;