import { GuildMember, Message, MessageEmbed } from 'discord.js';
import moment from 'moment';

import { BotCommand } from '..';
import MD from '../../utils/md';
import { createGetHelp } from '../../utils/messageEmbed';

const memberMessageEmbed = async (member: GuildMember) => {    
    return new MessageEmbed()
        .setColor(`#${process.env.BOT_MESSAGE_EMBED_HEX_COLOR}`)
        .setTitle(`Tag ${member.user.username}#${member.user.discriminator}`)
        .addFields([
            ...member.nickname ? [{ name: 'Nickname', value: member.nickname || '', inline: true }] : [],
            ...member.joinedAt ? [{ name: 'Joined Since', value: moment(member.joinedAt).fromNow(), inline: true }] : [],
            { name: 'Roles', value: member.roles.cache.map((role, key, collection) => MD.codeBlock.line(`[${role.name}]`)).join(' ') }
        ])
        .setThumbnail(member.user.avatarURL() || '')
}

const handleMember = async (message: Message, args: string[]): Promise<GuildMember | undefined> => {
    if (args.length) {
        return message.mentions.members?.first() ||
            (await message.guild?.members.search({ query: args.join(' '), limit: 1 }))?.first();
    }
    return (await handleMember(message, [message.author.username]));
}

const command: BotCommand = {
    name: 'userinfo',
    category: 'Utility',
    aliases: ['whois', 'who', 'user'],
    description: 'Get from your server a member info',
    usage: [
        [{
            required: false, arg: 'user',
            description: `The reference of any member from the server like ${MD.codeBlock.line('[mention | username | nickname | memberId]')}.`
        }],
    ],
    getHelp: (customPrefix) => createGetHelp(command, customPrefix || process.env.BOT_PREFIX),
    exec: async (message, args) => {
        const member = await handleMember(message, args);
        if (member) return message.reply({ embeds: [await memberMessageEmbed(member)] });
        return message.reply('Sorry, i do not found any member');
    }
}

export default command;