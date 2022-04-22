import { DiscordBot } from "../config";
import GuildRepository from "../domain/guild/GuildRepository.mongo";

class Guild {
    static async create(guildId: string) {
        try {
            return await GuildRepository.create({
                _id: guildId,
                bot: {
                    locale: 'pt-BR',
                    messageEmbedHexColor: DiscordBot.Bot.defaultBotHexColor,
                    prefix: DiscordBot.Bot.defaultPrefix,
                }
            });
        } catch (error) {
            throw error;
        }
    }    

    static async delete(guildId: string){
        try {
            await GuildRepository.delete(guildId);
        } catch (error) {
            throw error;
        }
    }

    static async findById(guildId: string) {
        try {
            return await GuildRepository.findById(guildId);
        } catch (error) {
            throw error;
        }
    }
}

export default Guild;