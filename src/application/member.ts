import { Guild, GuildMember, Message } from "discord.js";

class Member {
    static async search(message: Message, member: string): Promise<GuildMember | undefined> {
        if (!Number.isNaN(Number(member))) {
            const _member = await message.guild?.members.fetch({ user: member, limit: 1 });
            if (_member?.user) return _member;
        }
        return message.mentions.members?.first() ||
            (await message.guild?.members.search({ query: member, limit: 1 }))?.first();
    }

    static async find({ guild, member }: { member: string, guild: Guild }) {
        if (!Number.isNaN(Number(member))) {
            const _member = await guild?.members.fetch({ user: member, limit: 1 });
            if (_member?.user) return _member;
        }
        return (await guild?.members.search({ query: member, limit: 1 }))?.first();
    }
}

export default Member;