import mongoose from "mongoose";
import ScheduleUnmuteSchema, { IScheduleUnmute } from "./ScheduleUnmute.schema";

class ScheduleUnmuteRepository {
    static async create(scheduleUnmute: IScheduleUnmute) {
        try {
            return (await ScheduleUnmuteSchema.create(scheduleUnmute)).toJSON();
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

    static async delete(_id: mongoose.Types.ObjectId) {
        try {
            await ScheduleUnmuteSchema.findByIdAndDelete(_id);
        } catch (error) {
            console.error(error);
            throw new Error('[errorScheduleUnmuteRepositoryDelete]');
        }
    }
}

export default ScheduleUnmuteRepository;