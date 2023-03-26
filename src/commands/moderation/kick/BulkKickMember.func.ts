import { EmbedBuilder, GuildMember } from "discord.js";

const BulkKickMembers = async function (guildMembers: GuildMember[], authorReason: string, reason?: string | EmbedBuilder) {
    const kickedPromise = guildMembers.map(async guildMember => {
        if (guildMember.kickable) {
            (reason ? await guildMember.send(typeof reason === 'string' ? reason : { embeds: [reason] }) : undefined)
            return guildMember.kick(authorReason);
        }
    });
    const result = (await Promise.allSettled(kickedPromise)).reduce((prev, current) => {
        if (current.status === 'fulfilled') prev.success++;
        else prev.failed++;
        return prev;
    }, { success: 0, failed: 0 });
    return result;
}

export default BulkKickMembers;