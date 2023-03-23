import { Colors, Guild, PermissionFlagsBits } from "discord.js";

const createMutedRole = async (DiscordGuild: Guild) => {
    try {
        return await DiscordGuild.roles?.create({
            name: 'Silenced',
            color: Colors.Red,
            permissions: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect],
        });
    } catch (error) {
        throw error;
    }
}

export default createMutedRole;