import { Guild, MessageEmbed } from "discord.js";
import { BotCommand } from "..";
import { Member } from "../../application";
import MD from "../../utils/md";

const privateMessageEmbed = (message: string, guild: Guild) => {
    return new MessageEmbed()
        .setColor(`#${process.env.BOT_MESSAGE_EMBED_HEX_COLOR}`)
        .setTitle('You received a anonymous message')
        .setDescription(message)
        .setThumbnail(guild.iconURL() || '')
        .setFooter({ text: `By administration from ${guild.name}` })
        .setURL(`https://discord.com/channels/${guild.id}`)
}

const command: BotCommand = {
    name: 'anonymous-direct-message',
    category: 'Administration',
    aliases: ['adm'],
    description: 'I will send a anonymous message to a member from the server',
    allowedPermissions: ['ADMINISTRATOR'],
    usage: [
        [{
            required: true, arg: 'member',
            description: `The reference of any server member, can be ${MD.codeBlock.line('[mention | memberId]')}.`,
        }],
        [{
            required: true, arg: 'message',
            description: `Message to send to a server member.`,
            example: `${MD.codeBlock.line('{prefix}AnonymousDirectMessage @Poing Hello my friend')} - Will send an anonymous message to @Poing`
        }]
    ],
    exec: async (message, args) => {
        if (message.channel.type === 'DM' || !message.guild) return await message.reply('Can use only in servers.');
        if (args.length < 2) return await message.channel.send('I need more arguments');
        const member = await Member.search(message, args[0]);
        if (member) {
            const resultMessage = await member.send({ embeds: [privateMessageEmbed(args.slice(1).join(' '), message.guild)] } || '');
            if (resultMessage) return await message.react('✅');
            else await message.reply('I cannot send your message :C sorry.');
        }
        return await message.reply('Member not found');
    }
}

export default command;