import locale from '../../../locale/example.locale.json';
import Member from "../../../application/Member";

import type { BotArgument } from "../../index.types";

const argument: Record<'MEMBER' | 'REASON', BotArgument> = {
    MEMBER: {
        name: 'member',
        description: locale.usage.argument.member.description,
        example: locale.command.kick.usage.memberExample,
        required: true,
        async filter(message, args, locale) {
            if (!args[0]) throw new Error(locale.interaction.needArguments);
            const member = message.mentions.members?.first() ?? await Member.find({ guild: message.guild!, member: args[0] })
            return member;
        }
    },
    REASON: {
        name: 'reason',
        description: locale.usage.argument.reason.description,
        example: locale.command.kick.usage.reasonExample,
        required: false,
        filter(message, args, locale) {
            if (args[1]) return args.splice(1).join(' ');
        }
    }
}

export const getHowToUse = () => {
    const command = '{bot.prefix}kick';
    const { REASON } = argument;
    const howToUse = `
    ${command} [@Member|MemberID]* (${REASON.name})
    `.trim();
    return howToUse;
}

export default argument;