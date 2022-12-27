import WelcomeModuleRepository from "../domain/modules/welcomeModule/WelcomeModuleRepository.mongo";

class Modules {

    static async getWelcomeSettingsById(moduleId: string) {
        return await WelcomeModuleRepository.findById(moduleId);
    }

}

export default Modules;