import { BotCommand } from "..";
import { MemberApplication } from "../../application";
import { PM } from "../../components/messageEmbed";
import locale from '../../locale/example.locale.json';

const command: BotCommand = {
    name: 'anonymous-direct-message',
    category: locale.category.administration,
    aliases: ['adm'],
    description: locale.command.anonymousDirectMessage.description,
    allowedPermissions: ['ADMINISTRATOR'],
    usage: [
        [{
            required: true, arg: locale.usage.argument.member.arg,
            description: locale.usage.argument.member.description,
        }],
        [{
            required: true, arg: locale.usage.argument.message.arg,
            description: locale.usage.argument.member.description,
            example: locale.command.anonymousDirectMessage.usage.messageExample
        }]
    ],
    exec: async (message, args, options) => {
        if (message.channel.type === 'DM' || !message.guild) return { content: options.locale.interaction.isDMMessage };
        if (args.length < 2) return { content: options.locale.interaction.needArguments };

        const member = await MemberApplication.search(message, args[0]);
        if (member) {
            const resultMessage = await member.send({ embeds: [PM.normalMessage(args.slice(1).join(' '), message.guild, options)] } || '');
            if (resultMessage) {
                await message.react('✅');
                return;
            }
            else return { content: options.locale.interaction.cannotSendPrivateMessage };
        }
        return { content: options.locale.interaction.member.notFound };
    }
}

export default command;