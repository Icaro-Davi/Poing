import { createNewEvent } from ".";
import execSlashCommand from "../commands/command.slash";

export default createNewEvent('interactionCreate', async (event, interaction) => {
    try {
        if (interaction.user.bot) return;
        if (interaction.isCommand()) {
            await execSlashCommand(interaction);
        }
    } catch (error) {
        console.error('[EVENT_INTERACTION_CREATE] Error on src.events.interactionCreate \n', error);
    }
});