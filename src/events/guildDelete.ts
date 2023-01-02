import { createNewEvent } from ".";
import { GuildApplication } from "../application";

export default createNewEvent('guildDelete', async (event, guild) => {
    try {
        await GuildApplication.delete(guild.id);
    } catch (error) {
        console.error('[EVENT_GUILD_DELETE] error on src.events.guildDelete \n', error);
    }
});