import MemberLeaveRepository from "./MemberLeaveModuleRepository";

import type { ClientSession, Types } from 'mongoose';

class MemberLeaveModuleRepository {
    static async findById(memberLeaveModuleId: Types.ObjectId) {
        try {
            return (await MemberLeaveRepository.findById(memberLeaveModuleId));
        } catch (error) {
            throw error;
        }
    }

    static async delete(memberLeaveModuleId: string, options?: { session: ClientSession }) {
        try {
            await MemberLeaveRepository.findByIdAndRemove(memberLeaveModuleId, { session: options?.session });
        } catch (error) {
            throw error;
        }
    }
}

export default MemberLeaveModuleRepository;