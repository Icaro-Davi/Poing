import { createFilter } from "../../argument.utils";
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