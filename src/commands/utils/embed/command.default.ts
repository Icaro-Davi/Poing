import { middleware } from "../../command.middleware";
import CreateEmbedFromString from "./createEmbedFromString.func";

const execCommandDefault = middleware.create('COMMAND', async (message, args, options, next) => {
    const flags = options.context.data.flags;
    await CreateEmbedFromString({
        options, message,
        embedMessageFlags: flags,
        async onFinish(embed) {
            await message.channel.send({ embeds: [embed] });
            options.context.argument.embed = embed;
            next();
        },
    });
});

export default execCommandDefault;