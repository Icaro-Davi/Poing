import { GuildMember, Message } from "discord.js";

class Member {
    static async search(message: Message, args: string[]): Promise<GuildMember | undefined> {
        if (args.length) {
            if (!Number.isNaN(Number(args[0]))) {
                const member = await message.guild?.members.fetch({ user: args.join(' '), limit: 1 });
                if (member?.user) return member;
            }
            return message.mentions.members?.first() ||
                (await message.guild?.members.search({ query: args.join(' '), limit: 1 }))?.first();
        }
        return undefined;
    }
}

export default Member;