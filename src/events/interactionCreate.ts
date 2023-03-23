import { createNewEvent } from ".";
import execSlashCommand from "../commands/command.slash";
import RoleByInteraction from "../modules/roleByInteraction.module";

export default createNewEvent('interactionCreate', async (event, interaction) => {
    try {
        if (interaction.user.bot) return;
        if (interaction.isChatInputCommand()) {
            await execSlashCommand(interaction);
        } else if (interaction.isButton()) {
            if (await RoleByInteraction.validateEvent(event, true).exec(interaction)) return;
        } else if (interaction.isStringSelectMenu()) {
            if (await RoleByInteraction.validateEvent(event, true).exec(interaction)) return;
        }
    } catch (error) {
        console.error('[EVENT_INTERACTION_CREATE] Error on src.events.interactionCreate \n', error);
    }
});