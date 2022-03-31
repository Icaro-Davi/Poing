import { BotCommand } from "..";
import { Member } from "../../application";
import MD from "../../utils/md";
import { createGetHelp } from "../../utils/messageEmbed";

const command: BotCommand = {
    name: 'kick',
    category: 'Moderation',
    description: 'Kick a member from the server.',
    allowedPermissions: ['ADMINISTRATOR', 'KICK_MEMBERS'],
    usage: [
        [{
            required: true, arg: 'user',
            description: `You can use ${MD.codeBlock.line('[mention | username | nickname | memberId]')}`,
            example: `${MD.codeBlock.line('{prefix}kick @Poing')} - User @Poing will be kicked from the server.`
        }],
        [{
            required: false, arg: 'reason=',
            description: `Reason for kick the member from the server, ${MD.codeBlock.line('[reason= | --r=]')}.`,
            example: `${MD.codeBlock.line('{prefix}kick @Poing reason=Poing is jumping through the server.')} - It will kick @Poing with a reason.`
        }]
    ],
    getHelp: (customPrefix) => createGetHelp(command, customPrefix),
    exec: async (message, args) => {
        let argReasonIndex = args.join(' ').search((/(reason=|--r=)/gi));
        let user = undefined;
        let reason = undefined;
        if (argReasonIndex > 0) {
            user = args.join(' ').slice(0, argReasonIndex).trim();
            reason = args.join(' ').slice(argReasonIndex).replace(/(reason=|--r=)/gi, '').trim();
        }
        const member = await Member.search(message, user ? [user] : args);
        if (member) {
            if (member.kickable) {
                const kikedMember = await member.kick(reason);
                return kikedMember ? message.channel.send(`${kikedMember.user.username} was kicked!`) : false;
            }
            return message.channel.send('I cannot kick this member.');
        }
        return message.channel.send('User not found');
    }
};

export default command;