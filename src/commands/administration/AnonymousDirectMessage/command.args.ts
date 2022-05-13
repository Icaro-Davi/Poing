import Member from '../../../application/Member';
import locale from '../../../locale/example.locale.json';
import MD from '../../../utils/md';
import { BotArgument } from '../../index.types';

const argument: Record<'MEMBER' | 'MESSAGE', BotArgument> = {
    MEMBER: {
        required: true,
        name: 'member',
        description: locale.usage.argument.member.description,
        async filter(message, args, locale) {
            if (!args[0] && this.required) throw new Error(locale.interaction.needArguments);
            const member = message.mentions.members?.first() ?? (await Member.find({ guild: message.guild!, member: args[0] }));
            if (!member) throw new Error(locale.interaction.member.notFound);
            return member;
        }
    },
    MESSAGE: {
        required: true,
        name: 'message',
        description: locale.usage.argument.message.description,
        example: locale.command.anonymousDirectMessage.usage.messageExample,
        filter(message, args, locale) {
            const _message = args.slice(1).join(' ');
            if (!_message && this.required) throw new Error(locale.interaction.needArguments);
            return _message;
        }
    }
}

export const getHowToUse = () => {
    const command = '{bot.prefix}anonymous-direct-message';
    const { MEMBER, MESSAGE } = argument;
    const howToUse = `${command} \\[@${MEMBER.name}|memberID\\]* \\[${MESSAGE.name}\\]*`;
    return MD.codeBlock.line(howToUse);
}

export default argument;