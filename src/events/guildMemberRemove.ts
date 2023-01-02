import { DiscordBot } from "../config"
import MemberLeaveModule from '../modules/memberLeave.module';
import { createNewEvent } from ".";

export default createNewEvent('guildMemberRemove', async (event, member) => {
    try {
        const guild = await DiscordBot.GuildMemory.get(member.guild.id);

        await MemberLeaveModule
            .validateEvent(event, !!guild.config.modules?.memberLeave?.isActive)
            .exec(member, guild.config);

    } catch (error) {
        console.log('[EVENT_GUILD_MEMBER_REMOVE] error on src.events.guildMemberRemove \n', error);
    }
});