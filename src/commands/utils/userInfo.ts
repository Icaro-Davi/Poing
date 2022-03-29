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

const searchMember = async (message: Message, args: string[]): Promise<GuildMember | undefined> => {
    try {
        if (args.length) {
            if (!Number.isNaN(Number(args.join(' ')))){
                const member = (await message.guild?.members.fetch({ user: args.join(' '), limit: 1 }));                
                if(member?.user) return member;
            }
            return message.mentions.members?.first() ||
                (await message.guild?.members.search({ query: args.join(' '), limit: 1 }))?.first();
        }
        return (await searchMember(message, [message.author.username]));
    } catch (error) {
        console.log(error)
        message.channel.send('I could not complete this adventure to search your member friend, something wrong.')
    }
}

const command: BotCommand = {
    name: 'userinfo',
    category: 'Utility',
    aliases: ['whois', 'who', 'user'],
    description: 'Look up information about a specific member on the server.',
    usage: [
        [
            {
                required: false, arg: 'user',
                description: `The reference of any server member, can be ${MD.codeBlock.line('[mention | username | nickname | memberId]')}.`,
                example: `${MD.codeBlock.line(`{prefix}userinfo @${process.env.BOT_NAME}`)} - Will return information about @${process.env.BOT_NAME}.`
            },
            {
                required: false, arg: 'none',
                description: `No need arguments, will return info about you.`,
                example: `${MD.codeBlock.line('{prefix}userinfo')} - Will return your information.`
            }
        ],
    ],
    getHelp: (customPrefix) => createGetHelp(command, customPrefix || process.env.BOT_PREFIX),
    exec: async (message, args) => {
        const member = await searchMember(message, args);        
        if (member) return message.reply({ embeds: [await memberMessageEmbed(member)] });
        return message.reply('Sorry, I could not find any members');
    }
}

export default command;