import mongoose from "mongoose";
import { DiscordBot } from "../config";
import GuildRepository from "../domain/guild/GuildRepository.mongo";
import ScheduleUnmuteRepository from "../domain/schedule/unmute/ScheduleUnmuteRepository.mongo";

import type { LocaleLabel } from "../locale";
import WelcomeModuleRepository from "../domain/modules/memberWelcomeModule/WelcomeModuleRepository.mongo";
import MemberLeaveModuleRepository from "../domain/modules/memberLeaveModule/MemberLeaveModuleRepository.mongo";
import { createErrorLog } from "../utils/logs";

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
                if (typeof guild.modules?.memberLeave?.settings === 'string')
                    await MemberLeaveModuleRepository.delete(guild.modules?.memberLeave?.settings, { session });
                await session.commitTransaction();
            }
        } catch (error) {
            await session.abortTransaction();
            let errorMessage = `[ERROR_DELETE_GUILD] Error on src.application.Guild, failed to remove {guildId:${guildId}}`;
            createErrorLog({ errorMessage });
            console.error(errorMessage, '\n', error);
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