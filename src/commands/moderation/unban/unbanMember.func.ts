import { Guild, User } from "discord.js";
import { ExecuteCommandOptions, ExecuteCommandReturn } from "../../index.types";

type UnbanMemberOptions = {
    guild: Guild;
    bannedMemberID: string;
    options: ExecuteCommandOptions;
    author: User;
    reason?: string;
    ephemeral?: boolean;
}

const unbanMember = async ({ author, bannedMemberID, guild, options, reason, ephemeral }: UnbanMemberOptions): ExecuteCommandReturn => {
    if (Number.isNaN(Number(bannedMemberID))) return { content: options.locale.interaction.onlyNumbers };

    const memberBanned = await guild.bans.fetch(bannedMemberID);
    if (!memberBanned) return { content: options.locale.interaction.member.notFound };
    const user = await guild.bans.remove(memberBanned.user, reason);
    if (!user) return { content: options.locale.command.unban.interaction.cantUnban };
    return {
        ephemeral,
        content: options.locale.command.unban.interaction.memberUnbaned,
        vars: { unbanedMember: user, authorMention: `<@${author.id}>` }
    };
}

export default unbanMember;