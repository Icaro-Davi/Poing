import { BotApplication } from "../application";
import type { IBotSchema } from "../domain/bot/Bot.schema";

type GuildSlot = {
    config: IBotSchema;
    updateCount: number;
    timeoutReference: NodeJS.Timeout;
}

class GuildMemory {
    private static readonly nextUpdateLimit = 100;
    private static readonly timerToDestroyGuildSlotInMilliseconds = 1000 * 60 * 2;
    private static readonly maxGuildSavedInMemorySize = 1000;
    private static readonly guildConfigs: Map<string, GuildSlot> = new Map<string, GuildSlot>();

    private static saveGuild(guildId: string, botConfig: IBotSchema) {
        this.guildConfigs.set(guildId, {
            config: botConfig,
            updateCount: 0,
            timeoutReference: this.startTimerToDestroyGuildSlot(guildId)
        });
    }

    static async getConfigs(guildId: string) {
        const guildSlot = this.guildConfigs.get(guildId);
        const haveGuildSlotInMemory = this.guildConfigs.size < this.maxGuildSavedInMemorySize;
        if (guildSlot) {
            this.updateConfig(guildId, guildSlot);
            return guildSlot.config;
        } else {
            const botConf = await BotApplication.getConfigurations(guildId);
            haveGuildSlotInMemory && this.saveGuild(guildId, botConf);
            return botConf;
        }
    }

    static removeConfig(guildId: string) {
        return this.guildConfigs.delete(guildId);
    }

    private static async updateConfig(guildId: string, config: GuildSlot) {
        clearTimeout(config.timeoutReference);
        if (this.nextUpdateLimit > config.updateCount + 1) {
            config.timeoutReference = this.startTimerToDestroyGuildSlot(guildId);
            config.updateCount++;
        } else {
            const botConf = await BotApplication.getConfigurations(guildId);
            this.saveGuild(guildId, botConf);
        }
    }

    private static startTimerToDestroyGuildSlot(guildId: string) {
        return setTimeout(() => { this.removeConfig(guildId); }, this.timerToDestroyGuildSlotInMilliseconds);
    }

}

export default GuildMemory;