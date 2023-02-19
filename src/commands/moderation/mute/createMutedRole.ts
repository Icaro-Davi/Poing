import { Guild } from "discord.js";

const createMutedRole = async (DiscordGuild: Guild) => {
    try {
        // create a way to verify if boy have permission if not send message that bot don't have permission to do that
        // Create a image that represents discord users with reputation data, create a best way ask in GPT tricks
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