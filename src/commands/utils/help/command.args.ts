import { createFilter } from "../../argument.utils";
import { middleware } from "../../command.middleware";
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

export const argsMiddleware = middleware.createGetArgument(
    async function (message, args, options, next) {
        const arg = {
            COMMAND: argument.COMMAND(options),
            LIST: argument.LIST(options),
            TARGET: argument.TARGET(options),
        }
        const commandName = args.get(arg.COMMAND.name);
        const isList = args.get(arg.LIST.name);
        const subCommand = (() => {
            if (isList) return arg.LIST.name;
            return '';
        })();

        options.context.argument = {
            isCommand: commandName!!,
            isList: isList!!,
            subCommand,
        }
        options.context.data = {
            commandName: args.get(argument.COMMAND(options).name)
        }
        next();
    },
    async function (interaction, options, next) {
        const subCommand = interaction.options.getSubcommand(true);
        const arg = {
            COMMAND: argument.COMMAND(options),
            LIST: argument.LIST(options),
            TARGET: argument.TARGET(options),
        }
        options.context.argument = {
            subCommand,
            isList: subCommand === arg.LIST.name,
            isCommand: (subCommand === arg.COMMAND.name),
        }
        if (options.context.argument.isCommand) {
            const commandName = interaction.options.getString(arg.TARGET.name, arg.TARGET.required);
            options.context.data = { commandName };
        }
        next();
    }
);