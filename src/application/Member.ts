import { Guild } from "discord.js";

class Member {
    static async find({ guild, member }: { member: string, guild: Guild }) {
        if (!Number.isNaN(Number(member))) {
            const _member = await guild?.members.fetch({ user: member, limit: 1, cache: true });
            if (_member?.user) return _member;
        }
        return (await guild?.members.search({ query: member, limit: 1 }))?.first();
    }
}

export default Member;
