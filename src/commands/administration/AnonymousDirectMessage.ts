import { BotCommand } from "..";
import { Member } from "../../application";
import { PM } from "../../components/messageEmbed";

const command: BotCommand = {
    name: 'anonymous-direct-message',
    category: '{category.administration}',
    aliases: ['adm'],
    description: '{command.anonymousDirectMessage.description}',
    allowedPermissions: ['ADMINISTRATOR'],
    usage: [
        [{
            required: true, arg: '{usage.member.arg}',
            description: '{usage.member.description}',
        }],
        [{
            required: true, arg: '{usage.message.arg}',
            description: '{usage.message.description}',
            example: '{command.anonymousDirectMessage.usage.messageExample}'
        }]
    ],
    exec: async (message, args, options) => {
        if (message.channel.type === 'DM' || !message.guild) return await message.reply(options.locale.interaction.isDMMessage);
        if (args.length < 2) return await message.channel.send(options.locale.interaction.needArguments);
        const member = await Member.search(message, args[0]);
        if (member) {            
            const resultMessage = await member.send({ embeds: [PM.normalMessage(args.slice(1).join(' '), message.guild, options)] } || '');
            if (resultMessage) return await message.react('✅');
            else await message.reply(options.locale.interaction.cannotSendPrivateMessage);
        }
        return await message.reply(options.locale.interaction.memberNotFound);
    }
}

export default command;