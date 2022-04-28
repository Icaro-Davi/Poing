import { GuildMember, MessageEmbed } from 'discord.js';
import moment from 'moment';

import { BotCommand, ExecuteCommandOptions } from '..';
import { MemberApplication } from '../../application';
import MD from '../../utils/md';
import locale from '../../locale/example.locale.json';

const memberMessageEmbed = async (member: GuildMember, options: ExecuteCommandOptions) => {
    return new MessageEmbed()
        .setColor(options.bot.hexColor)
        .setTitle(`Tag ${member.user.tag}`)
        .addFields([
            ...member.nickname ? [{ name: options.locale.labels.nickname, value: member.nickname || '', inline: true }] : [],
            { name: 'Status', value: member.presence?.status ? options.locale.status[member.presence.status] : 'offline', inline: true },
            ...member.user.createdTimestamp ? [{ name: options.locale.labels.joinedDiscord, value: moment(member.user.createdTimestamp).locale(options.locale.localeLabel).fromNow(), inline: true }] : [],
            ...member.joinedAt ? [{ name: options.locale.labels.joinedServer, value: moment(member.joinedAt).locale(options.locale.localeLabel).fromNow(), inline: true }] : [],
            { name: 'ID', value: member.id },
            { name: options.locale.labels.roles, value: member.roles.cache.map((role, key, collection) => MD.codeBlock.line(`[${role.name}]`)).join(' ') }
        ])
        .setThumbnail(member.user.avatarURL() || '')
}

const command: BotCommand = {
    name: 'userinfo',
    category: locale.category.utility,
    aliases: ['whois', 'who', 'user'],
    description: locale.command.userInfo.description,
    usage: [
        [
            {
                required: false, arg: locale.usage.argument.member.arg,
                description: locale.usage.argument.member.description,
                example: locale.command.userInfo.usage.exampleMember
            }
        ],
    ],
    exec: async (message, args, options) => {
        const member = await MemberApplication.search(message, args[0] || message.author.id);
        if (member) return { content: await memberMessageEmbed(member, options), type: 'embed' };
        return { content: options.locale.interaction.member.notFound, type: 'embed' };
    }
}

export default command;