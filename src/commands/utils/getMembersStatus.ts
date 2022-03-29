import { Message, MessageEmbed } from 'discord.js';
import { BotCommand } from '..';
import MD from '../../utils/md';
import { createGetHelp } from '../../utils/messageEmbed';

const getAllMembers = async (message: Message) => {
    const membersStatusCount = await message.guild?.members.cache
        .reduce<{ [key: string]: number }>((prev, member) => {
            if (member.presence?.status) {
                if (prev[member.presence.status]) prev[member.presence.status] += 1;
                else prev[member.presence.status] = 1;
            }
            return prev;
        }, {});
    let onlineMemberText = `${MD.bold.b(':green_circle: Online:')} ${membersStatusCount?.online || 0}`;
    let idleMemberText = `${MD.bold.b(':yellow_circle: Idle:')} ${membersStatusCount?.idle || 0}`;
    let dndMemberText = `${MD.bold.b(':red_circle: Do not disturb:')} ${membersStatusCount?.dnd || 0}`;
    let offlineMemberText = `${MD.bold.b(':white_circle: Offline:')} ${membersStatusCount?.offline || 0}`;
    let totalMemberText = `${MD.bold.b(':blue_circle: Total:')} ${message.guild?.memberCount || 0}`;
    message.reply({
        embeds: [
            new MessageEmbed()
                .setColor(`#${process.env.BOT_MESSAGE_EMBED_HEX_COLOR}`)
                .setTitle('Member Status')
                .setDescription(`${onlineMemberText}\n${idleMemberText}\n${dndMemberText}\n${offlineMemberText}\n${totalMemberText}`)
        ]
    });
}

const command: BotCommand = {
    name: 'get-members-status',
    category: 'Utility',
    description: 'I will return the amount of online members in this server.',
    aliases: ['gms'],
    getHelp: (customPrefix) => createGetHelp(command, customPrefix),
    exec: (message, args) => {
        getAllMembers(message);
    }
}

export default command;
