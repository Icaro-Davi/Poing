import { ColorResolvable } from "discord.js";

export type BotConf = {
    prefix: string;
    embedMessageColor: ColorResolvable;
    locale: 'pt-BR' | 'en-US';
}

export type BotMute = {
    roleId: string;
    membersTimeout: { memberId: string, mutedTime: number }[];
}

export type GuildMemoryReferences = {
    id: string;
    blockedWords: string[];
    bot: BotConf;
    mute: BotMute;
}

class GuildMemory {
    private static guilds: { [key: string]: GuildMemoryReferences } = {};

    static getAll(){
        return this.guilds;
    }

    static get(guildId: string) {
        return this.guilds[guildId];
    }

    static add(guild: GuildMemoryReferences) {
        this.guilds[guild.id] = guild;
    }

    static update(guild: GuildMemoryReferences) {
        if (guild.id) {
            this.guilds[guild.id] = guild;
        }
    }

    static remove(guildId: number) {
        return delete this.guilds[guildId];
    }
}

export default GuildMemory;