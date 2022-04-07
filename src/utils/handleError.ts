import { Message } from "discord.js";
import { Locale, LocaleErroTypes } from "../locale";

type HandleErrorOptions = {
    errorLocale: string;
    message: Message;
    locale: Locale;
    customMessage?: string;
}

const handleError = (error: any, options: HandleErrorOptions) => {
    console.error(`[error on ${options.errorLocale}] - code(${error.code || 'no code'}) message(${error.message || 'no message'}) userInput(${options.message.content})`);    
    options.message.channel.send(options.customMessage || options.locale.error[error.code as LocaleErroTypes || 'unknown']).catch(reason => console.log('[error on handleError] - Error on send message', reason));
}

export default handleError;