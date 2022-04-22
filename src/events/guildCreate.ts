
import { Guild, TextChannel } from "discord.js";
import { GuildApplication } from "../application";
import { DiscordBot } from "../config";

const onBotJoinGuild = async (guild: Guild) => {
    try {
        await GuildApplication.create(guild.id);
        const channel = guild.channels.cache.find(channel => channel.isText()) as TextChannel;
        await channel.send(`Hello you invite me to join in your server, i hope to help you :3\nIf you wanna see my commands just use <@${guild.me?.id}> help, or !help`);
    } catch (error) {
        console.error(error);
    }
}

export default () => DiscordBot.Client.get().on('guildCreate', onBotJoinGuild);