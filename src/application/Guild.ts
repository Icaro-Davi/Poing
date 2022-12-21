import mongoose from "mongoose";
import { DiscordBot } from "../config";
import GuildRepository from "../domain/guild/GuildRepository.mongo";
import ScheduleUnmuteRepository from "../domain/schedule/unmute/ScheduleUnmuteRepository.mongo";

import type { LocaleLabel } from "../locale";
import WelcomeModuleRepository from "../domain/modules/welcomeModule/WelcomeModuleRepository.mongo";

class Guild {
    static async create(guildId: string, locale: LocaleLabel = 'en-US') {
        try {
            return await GuildRepository.create({
                _id: guildId,
                bot: {
                    locale,
                    messageEmbedHexColor: DiscordBot.Bot.defaultBotHexColor,
                    prefix: DiscordBot.Bot.defaultPrefix,
                }
            });
        } catch (error) {
            throw error;
        }
    }

    static async delete(guildId: string) {
        const session = await mongoose.startSession();
        try {
            const guild = await GuildRepository.findById(guildId);
            if (guild) {
                session.startTransaction();
                await ScheduleUnmuteRepository.deleteManyByGuildId(guild._id, session);
                await GuildRepository.delete(guildId, session);
                if (typeof guild.modules?.welcomeMember?.settings === 'string')
                    await WelcomeModuleRepository.delete(guild.modules?.welcomeMember?.settings, { session });
                await session.commitTransaction();
            }
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
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