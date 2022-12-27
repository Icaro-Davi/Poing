import { DiscordBot } from "../config";

import type { GuildMember } from "discord.js";
import welcomeNewGuildMember from "../modules/newMemberJoined.module";

const guildMemberAdd = async (member: GuildMember) => {
    const guild = await DiscordBot.GuildMemory.get(member.guild.id);
    if (guild.config.modules?.welcomeMember?.isActive) {
        await welcomeNewGuildMember(member, guild.config).catch(err => {
            console.log('[welcomeMemberModule] Failed to send to a new guild Member \n', err);
        });
    }
}

export default () => DiscordBot.Client.on('guildMemberAdd', guildMemberAdd);