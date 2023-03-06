import { createNewEvent } from ".";
import { DiscordBot } from "../config";
import BotIntroductionToGuildModule from "../modules/botIntroductionToGuild.module";

export default createNewEvent('guildCreate', async (event, guild) => {
    try {
    } catch (error) {
        await BotIntroductionToGuildModule.validateEvent(event, true).exec(guild);
        console.error('[EVENT_GUILD_CREATE] error on src.events.guildCreate \n', error);
    } finally {
        console.log('Poing has a new guild', guild.name);
        await DiscordBot.Client.get().user?.setActivity({
            type: 'LISTENING',
            name: `I'm in ${DiscordBot.Client.get().guilds.cache.size} servers.`,
        });
    }
});