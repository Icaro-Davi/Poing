type GuildMemoryReferences = {
    id: number;
    blockWords: string[];
    bot: {
        prefix: string;
        embedMessageColor: string;
        locale: 'PT-BR' | 'EN-US';    
    };
}

class GuildMemory {
    private static guilds: { [key: number]: GuildMemoryReferences } = {};

    static get() {
        return this.guilds;
    }

    static add(guild: any) {
        this.guilds[guild.id] = guild;
    }

    static update(guild: any) {
        if (guild.id) {
            this.guilds[guild.id] = guild;
        }
    }

    static remove(guildId: number) {
        return delete this.guilds[guildId];
    }
}

export default GuildMemory;