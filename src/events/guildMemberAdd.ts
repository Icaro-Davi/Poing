import { DiscordBot } from "../config";

import type { GuildMember } from "discord.js";
import welcomeNewGuildMember from "../modules/newMemberJoined.module";

const guildMemberAdd = async (member: GuildMember) => {
    const guildConf = await DiscordBot.GuildMemory.getConfigs(member.guild.id);
    welcomeNewGuildMember(member, guildConf);
}

export default () => DiscordBot.Client.get().on('guildMemberAdd', guildMemberAdd);