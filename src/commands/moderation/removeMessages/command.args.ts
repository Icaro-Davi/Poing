import { createFilter } from "../../argument.utils";
import { middleware } from "../../command.middleware";
import { BotArgumentFunc } from "../../index.types";

const argument: Record<'QUANTITY', BotArgumentFunc> = {
    QUANTITY: (options) => ({
        name: 'quantity',
        description: options.locale.usage.argument.quantity.description,
        required: true,
        filter: createFilter(options, function (message, args) {
            if (!args[0]) return;
            if (Number.isNaN(Number(args[0]))) throw new Error(options.locale.interaction.onlyNumbers);
            return Number(args[0]);
        })
    })
}

export default argument;

export const argMiddleware = middleware.createGetArgument(
    async function (message, args, options, next) {
        const quantity = args.get(argument.QUANTITY(options).name);
        options.context.data = { quantity };
        next();
    },
    async function (interaction, options, next) {
        const arg = { QUANTITY: argument.QUANTITY(options) }
        const quantity = interaction.options.getNumber(arg.QUANTITY.name, arg.QUANTITY.required);
        options.context.data = { quantity };
        next();
    },
)