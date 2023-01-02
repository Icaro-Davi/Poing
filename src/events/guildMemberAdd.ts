import { DiscordBot } from "../config";
import welcomeNewGuildMember from "../modules/newMemberJoined.module";
import { createNewEvent } from ".";

import type { GuildMember } from "discord.js";

export default createNewEvent('guildMemberAdd', async (event, member: GuildMember) => {
    try {
        const guild = await DiscordBot.GuildMemory.get(member.guild.id);

        await welcomeNewGuildMember
            .validateEvent(event, !!guild.config.modules?.welcomeMember?.isActive)
            .exec(member, guild.config);

    } catch (error) {
        console.log('[EVENT_GUILD_MEMBER_ADD] error on src.events.guildMemberAdd \n', error);
    }
})