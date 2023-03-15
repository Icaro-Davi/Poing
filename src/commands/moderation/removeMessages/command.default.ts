import { middleware } from "../../command.middleware";
import deleteMessages from "./deleteMessage.func";

const execDefaultCommand = middleware.create('COMMAND', async function (message, args, options, next) {
    if (message.channel.type === 'DM' || message.channel.type === 'GUILD_VOICE') {
        next({ type: 'UNKNOWN' }); return;
    };
    const quantity = options.context.data.quantity;
    await deleteMessages({ channel: message.channel, locale: options.locale, quantity, message });
    next();
});

export default execDefaultCommand;