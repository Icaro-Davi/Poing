import { BotArgument } from "../../index.types";
import locale from '../../../locale/example.locale.json';
import MD from "../../../utils/md";

const argument: Record<'QUANTITY', BotArgument> = {
    QUANTITY: {
        name: 'quantity',
        description: locale.usage.argument.quantity.description,
        required: true,
        example: locale.command.removeMessages.usage.quantityExample,
        filter(message, args, locale) {
            if (!args[0]) throw new Error(locale.interaction.needArguments);
            if (Number.isNaN(Number(args[0]))) throw new Error(locale.interaction.onlyNumbers);
            return Number(args[0]);
        }
    }
}

export const getHowToUse = () => {
    const command = '{bot.prefix}remove-messages';
    const howToUse = `
    ${MD.codeBlock.line(`${command} \\[${argument.QUANTITY.name}\\]*`)}
    `.trim();
    return howToUse;
}

export default argument;