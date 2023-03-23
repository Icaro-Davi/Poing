import { middleware } from "../../command.middleware";
import deleteMessages from "./deleteMessage.func";

const execSlashCommand = middleware.create('COMMAND_INTERACTION', async function (interaction, options, next) {
    if (interaction.channel?.isTextBased()) {
        const quantity = options.context.data.quantity;
        if (!quantity) {
            next({ type: 'UNKNOWN' }); return;
        }
        await deleteMessages({ channel: interaction.channel!, locale: options.locale, ephemeral: true, quantity, interaction });
        next();
    } else {
        next({ type: 'UNKNOWN' });
    }
});

export default execSlashCommand;