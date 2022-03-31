import { GuildMember, Message } from "discord.js";

class Member {
    static async search(message: Message, args: string[]): Promise<GuildMember | undefined> {
        try {
            if (args.length) {
                if (!Number.isNaN(Number(args[0]))) {
                    const member = (await message.guild?.members.fetch({ user: args.join(' '), limit: 1 }));
                    if (member?.user) return member;
                }
                console.log(args.join(' '))
                return message.mentions.members?.first() ||
                    (await message.guild?.members.search({ query: args.join(' '), limit: 1 }))?.first();
            }
            return (await this.search(message, [message.author.username]));
        } catch (error) {
            message.channel.send('I could not complete this adventure to search your member friend, something wrong.')
        }
    }
}

export default Member;