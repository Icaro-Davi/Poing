import mongoose, { ClientSession } from "mongoose";
import ScheduleUnmuteSchema, { IScheduleUnmute } from "./ScheduleUnmute.schema";

class ScheduleUnmuteRepository {
    static async create(scheduleUnmute: IScheduleUnmute) {
        try {
            const conditions = { guildId: scheduleUnmute.guildId, memberId: scheduleUnmute.memberId };
            const update = { $set: { timeout: scheduleUnmute.timeout } };
            const options = { upsert: true, new: true, setDefaultsOnInsert: true };
            return (await ScheduleUnmuteSchema.findOneAndUpdate(conditions, update, options))?.toJSON();
        } catch (error) {
            console.error(error);
            throw new Error('[errorScheduleUnmuteRepositoryCreate]');
        }
    }

    static async findById(id: mongoose.Types.ObjectId) {
        try {
            return (await ScheduleUnmuteSchema.findById(id))?.toJSON();
        } catch (error) {
            console.error(error);
            throw new Error('[errorScheduleUnmuteRepositoryFindById]');
        }
    }

    static async listByDate(lessThan: Date) {
        try {
            return await ScheduleUnmuteSchema.find({
                timeout: {
                    $lte: lessThan
                }
            }).lean();
        } catch (error) {
            console.error(error);
            throw new Error('[errorScheduleUnmuteRepositoryListByDate]');
        }
    }

    static async listByGuildId(guildId: string, limit = 50) {
        try {
            return await ScheduleUnmuteSchema.find({ guildId }).sort({ timeout: 'asc' }).limit(limit).lean();
        } catch (error) {
            throw new Error('[errorScheduleUnmuteRepositoryListByGuildId]');
        }
    }

    static async delete(_id: mongoose.Types.ObjectId) {
        try {
            await ScheduleUnmuteSchema.findByIdAndDelete(_id);
        } catch (error) {
            console.error(error);
            throw new Error('[errorScheduleUnmuteRepositoryDelete]');
        }
    }

    static async findByGuildIdAndMemberId(guildId: string, memberId: string) {
        try {
            return await ScheduleUnmuteSchema.findOne({ guildId, memberId }).lean();
        } catch (error) {
            throw new Error('[errorScheduleUnmuteRepositoryFindByGuildIdAndMemberId]');
        }
    }

    static async deleteManyByGuildId(guildId: string, session?: ClientSession) {
        try {
            return await ScheduleUnmuteSchema.deleteMany({ guildId }, session ? { session } : {});
        } catch (error) {
            throw new Error('[errorScheduleUnmuteRepositoryDeleteManyByGuildId]');
        }
    }
}

export default ScheduleUnmuteRepository;