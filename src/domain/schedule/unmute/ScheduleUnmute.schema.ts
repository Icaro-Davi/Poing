import mongoose from "mongoose";

export interface IScheduleUnmute {
    guildId: string;
    memberId: string;
    timeout: Date;
}

const ScheduleUnmute = new mongoose.Schema<IScheduleUnmute>({
    guildId: {
        type: String,
        required: true,
        ref: 'Guild'
    },
    memberId: {
        type: String,
        required: true,
    },
    timeout: {
        type: Date,
        required: true,
    }
});

export default mongoose.model<IScheduleUnmute>('ScheduleUnmute', ScheduleUnmute);