import BotIntroductionToGuildModule from "../modules/botIntroductionToGuild.module";
import { createNewEvent } from ".";

export default createNewEvent('guildCreate', async (event, guild) => {
    try {
        await BotIntroductionToGuildModule.validateEvent(event, true).exec(guild);
    } catch (error) {
        console.error('[EVENT_GUILD_CREATE] error on src.events.guildCreate \n', error);
    } finally {
        console.log('Poing has a new guild', guild.name);
    }
});