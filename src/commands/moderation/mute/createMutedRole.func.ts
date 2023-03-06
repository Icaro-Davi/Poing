import { Guild } from "discord.js";

const createMutedRole = async (DiscordGuild: Guild) => {
    try {
        return await DiscordGuild.roles?.create({
            name: 'Silenced',
            color: 'RED',
            permissions: ['VIEW_CHANNEL', 'CONNECT', 'VIEW_CHANNEL'],
        });
    } catch (error) {
        throw error;
    }
}

export default createMutedRole;