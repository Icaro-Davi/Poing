import { DiscordBot } from "../config";
import { BotConf } from "../config/guildMemory";

class Bot {
    static getConfigurations(guildId: string) {
        try {
            return new Promise<BotConf>((res, rej) => {
                const guildRef = DiscordBot.GuildMemory.get(guildId);
                setTimeout(res, 200, guildRef.bot);
            });
        } catch (error) {
            // cannot search bot configurations.
            throw new Error('BOT_00001');
        }
    }
}

export default Bot;