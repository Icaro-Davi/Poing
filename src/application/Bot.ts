import { GuildApplication } from ".";
import GuildRepository from "../domain/guild/GuildRepository.mongo";

class Bot {
    static async getConfigurations(guildId: string) {
        try {
            const guild = await GuildRepository.findByIdAndOmitValues(guildId, { bot: { prefix: 1, locale: 1, messageEmbedHexColor: 1 } });
            if (!guild) {
                const _guild = await GuildApplication.create(guildId);
                if (!_guild) throw new Error();
                else return _guild.bot;
            }
            else return guild.bot;
        } catch (error) {
            // cannot search bot configurations.
            throw new Error('BOT_00001');
        }
    }
}

export default Bot;