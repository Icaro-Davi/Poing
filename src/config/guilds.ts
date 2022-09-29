import { DiscordBot } from ".";
import { BotApplication, GuildApplication } from "../application";
import type { IBotSchema } from "../domain/bot/Bot.schema";
import { IGuildSchema } from "../domain/guild/Guild.schema";

type GuildSlot = {
    config: Omit<IGuildSchema, '_id'>;
    updateCount: number;
    timeoutReference: NodeJS.Timeout;
}

class GuildMemory {
    private static readonly nextUpdateLimit = 100;
    private static readonly timerToDestroyGuildSlotInMilliseconds = 1000 * 60 * 2;
    private static readonly maxGuildSavedInMemorySize = 1000;
    private static readonly guildConfigs: Map<string, GuildSlot> = new Map<string, GuildSlot>();

    private static saveGuild(guildId: string, guild: IGuildSchema) {
        const { _id, ...rest } = guild;
        const guildSlot: GuildSlot = {
            config: rest,
            updateCount: 0,
            timeoutReference: this.startTimerToDestroyGuildSlot(guildId)
        }
        this.guildConfigs.set(guildId, guildSlot);
        return guildSlot;
    }

    static async get(guildId: string) {
        const guildSlot = this.guildConfigs.get(guildId);
        const haveGuildSlotInMemory = this.guildConfigs.size < this.maxGuildSavedInMemorySize;
        if (guildSlot) {
            this.updateConfig(guildId, guildSlot);
            return guildSlot;
        } else {
            const guild = await GuildApplication.findById(guildId);
            if ((haveGuildSlotInMemory && guild))
                return this.saveGuild(guildId, guild);
            else
                return {
                    config: {
                        bot: {
                            prefix: DiscordBot.Bot.defaultPrefix,
                            messageEmbedHexColor: DiscordBot.Bot.defaultBotHexColor,
                            locale: 'en-US'
                        }
                    }
                } as GuildSlot;
        }
    }

    static async getConfigs(guildId: string) {
        return (await this.get(guildId)).config.bot;
    }

    static async getModules(guildId: string) {
        return (await this.get(guildId)).config?.modules;
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
            const guild = await GuildApplication.findById(guildId);
            guild && this.saveGuild(guildId, guild);
        }
    }

    private static startTimerToDestroyGuildSlot(guildId: string) {
        return setTimeout(() => { this.removeConfig(guildId); }, this.timerToDestroyGuildSlotInMilliseconds);
    }

}

export default GuildMemory;