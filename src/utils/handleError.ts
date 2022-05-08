import { CommandInteraction, Message } from "discord.js";
import { Locale, LocaleErroTypes } from "../locale";
import { RequireAtLeastOne } from "./typescript.funcs";

type HandleErrorOptions = {
    errorLocale: string;
    message: Message;
    interaction: CommandInteraction;
    locale: Locale;
    customMessage?: string;
}

const handleError = (error: any, options: RequireAtLeastOne<HandleErrorOptions, 'message' | 'interaction'>) => {
    let input = undefined;
    if (options.interaction) input = options.interaction.options.data ? JSON.stringify(options.interaction.options.data) : 'Unnable to stringfy';
    if (options.message) input = options.message.content;

    console.error(`[error on ${options.errorLocale}] - code(${error.code || 'no code'}) message(${error.message || 'no message'}) userInput(${input})`);
    (options.message ?? options.interaction)!.reply(options.customMessage || options.locale.error[error.code as LocaleErroTypes || 'unknown']).catch(reason => console.log('[error on handleError] - Error on send message', reason));
}

export default handleError;