import { middleware } from "../../command.middleware";
import CreateEmbedCollectorData from "./createEmbedCollectorData.func";

const execCommandSlash = middleware.create('COMMAND_INTERACTION', async (interaction, options, next) => {
    await CreateEmbedCollectorData({
        interaction, options, events: {
            async onSubmit(embed) {
                await interaction.channel?.send({ embeds: [embed] });
                options.context.argument.embed = embed;
                next();
            },
        }
    });
});

export default execCommandSlash;