import { BotCommand } from "..";
import { Member } from "../../application";
import { privateMessage } from "../../utils/messageEmbed";

const command: BotCommand = {
    name: 'anonymous-direct-message',
    category: '{category.administration}', // 'Administration'
    aliases: ['adm'],
    description: '{command.anonymousDirectMessage.description}', //'I will send a anonymous message to a member from the server',
    allowedPermissions: ['ADMINISTRATOR'],
    usage: [
        [{
            required: true, arg: '{usage.member.arg}',
            description: '{usage.member.description}',
        }],
        [{
            required: true, arg: '{usage.message.arg}',
            description: '{usage.message.description}',// 'Message to send to a server member.',
            example: '{command.anonymousDirectMessage.usage.messageExample}' //`${MD.codeBlock.line('{prefix}AnonymousDirectMessage @Poing Hello my friend')} - Will send an anonymous message to @Poing`
        }]
    ],
    exec: async (message, args, options) => {
        if (message.channel.type === 'DM' || !message.guild) return await message.reply(options.locale.interaction.isDMMessage);
        if (args.length < 2) return await message.channel.send(options.locale.interaction.needArguments);
        const member = await Member.search(message, args[0]);
        if (member) {            
            const resultMessage = await member.send({ embeds: [privateMessage(args.slice(1).join(' '), message.guild, options)] } || '');
            if (resultMessage) return await message.react('✅');
            else await message.reply(options.locale.interaction.cannotSendPrivateMessage);
        }
        return await message.reply(options.locale.interaction.memberNotFound);
    }
}

export default command;