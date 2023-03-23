import { middleware } from "../../command.middleware";
import deleteMessages from "./deleteMessage.func";

const execDefaultCommand = middleware.create('COMMAND', async function (message, args, options, next) {
    if (message.channel.isTextBased()) {
        message.channel
        const quantity = options.context.data.quantity;
        await deleteMessages({ channel: message.channel, locale: options.locale, quantity, message });
        next();
    } else {
        next({ type: 'UNKNOWN' });
    }
});

export default execDefaultCommand;