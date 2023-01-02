import MemberLeaveModuleRepository from "../domain/modules/memberLeaveModule/MemberLeaveModuleRepository.mongo";
import WelcomeModuleRepository from "../domain/modules/memberWelcomeModule/WelcomeModuleRepository.mongo";
import type { Types } from 'mongoose';
import type { IMemberLeaveModule } from "../domain/modules/memberLeaveModule/MemberLeaveModule.schema";
import type { IWelcomeMemberModuleSettings } from "../domain/modules/memberWelcomeModule/WelcomeModule.schema";

class Modules {

    static async getWelcomeSettingsById(moduleId: Types.ObjectId) {
        return await WelcomeModuleRepository.findById(moduleId) as IWelcomeMemberModuleSettings | undefined;
    }

    static async getMemberLeaveSettingsById(moduleId: Types.ObjectId) {
        return await MemberLeaveModuleRepository.findById(moduleId) as IMemberLeaveModule | undefined;
    }

}

export default Modules;