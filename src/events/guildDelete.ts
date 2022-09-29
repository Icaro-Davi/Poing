import { Guild } from "discord.js";
import { GuildApplication } from "../application";
import { DiscordBot } from "../config";

const onLeaveGuild = async (guild: Guild) => {
    try {
        await GuildApplication.delete(guild.id);
    } catch (error) {
        console.error(error);
    }
}

export default () => DiscordBot.Client.on('guildDelete', onLeaveGuild);