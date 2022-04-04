import { BotCommand } from "..";
import { Member } from "../../application";
import MD from "../../utils/md";

const command: BotCommand = {
    name: 'kick',
    category: 'Moderation',
    description: 'Kick a member from the server.',
    allowedPermissions: ['KICK_MEMBERS'],
    usage: [
        [{
            required: true, arg: 'member',
            description: `You can use ${MD.codeBlock.line('[mention | memberId]')}`,
            example: `${MD.codeBlock.line('{prefix}kick @Poing')} - User @Poing will be kicked from the server (Please does not kick me ;w;).`
        }],
        [{
            required: false, arg: 'reason',
            description: `Reason for kick the member from the server'.`,
            example: `${MD.codeBlock.line('{prefix}kick @Poing Poing is jumping through the server.')} - It will kick @Poing with a reason.(Do not do that ;w;)`
        }]
    ],
    exec: async (message, args) => {
        const member = await Member.search(message, args[0]);
        if (member) {
            if (member.kickable) {
                const kikedMember = await member.kick(args.slice(1).join(' ') || '');
                return kikedMember ? await message.channel.send(`Bye ${kikedMember.user.username}`) : false;
            }
            return await message.channel.send('I cannot kick this member.');
        }
        return await message.channel.send('User not found');
    }
};

export default command;