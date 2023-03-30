import { EmbedBuilder, GuildMember } from "discord.js";
import RateLimit from "../../../utils/RateLimit";

const BulkKickMembers = async function (guildMembers: GuildMember[], authorReason: string, reason?: string | EmbedBuilder) {
    const rateLimit = new RateLimit<GuildMember | undefined>({ interval: 1000, limit: 2 });

    guildMembers.forEach(async guildMember => {
        rateLimit.schedule(async () => {
            if (guildMember.kickable) {
                (reason ? await guildMember.send(typeof reason === 'string' ? reason : { embeds: [reason] }) : undefined)
                return guildMember.kick(authorReason);
            }
        });
    });

    const result = (await rateLimit.exec())
        .reduce((prev, current) => {
            if (current.status === 'fulfilled') prev.success++;
            else prev.failed++;
            return prev;
        }, { success: 0, failed: 0 });

    return result;
}

export default BulkKickMembers;