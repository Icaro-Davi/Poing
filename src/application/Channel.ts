import type { Guild, TextChannel } from "discord.js";

class Channel {
    static async getMainTextChannel(guild: Guild, options?: { rawPosition?: number; }) {
        const rawPosition = options?.rawPosition ?? 0;
        return <TextChannel | undefined>await guild.channels.cache.find(channel => channel.isText());
    }
}

export default Channel;