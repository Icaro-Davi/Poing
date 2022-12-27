import WelcomeMemberModuleSchema from './WelcomeModule.schema';

import type { ObjectId, ClientSession } from 'mongoose';

class WelcomeModuleRepository {
    static async findById(moduleId: string){
        try {
            return (await WelcomeMemberModuleSchema.findById(moduleId))?.toJSON();
        } catch (error) {
            throw error;
        }
    }

    static async delete(welcomeMemberModuleId: ObjectId, options: { session?: ClientSession }) {
        try {
            await WelcomeMemberModuleSchema.findByIdAndRemove(welcomeMemberModuleId, { session: options?.session });
        } catch (error) {
            throw error;
        }
    }
}

export default WelcomeModuleRepository;