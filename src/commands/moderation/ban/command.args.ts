import { BotArgument } from "../../index.types";
import locale from '../../../locale/example.locale.json';
import Member from "../../../application/Member";
import getValuesFromStringFlag from "../../../utils/regex/getValuesFromStringFlag";
import MD from "../../../utils/md";

const argument: Record<'MEMBER' | 'DAYS' | 'REASON', BotArgument> = {
    MEMBER: {
        required: true,
        name: 'member',
        description: locale.usage.argument.member.description,
        async filter(message, args, locale) {
            if (!args[0] && this.required) throw new Error(locale.interaction.needArguments);
            const member = message.mentions.members?.first() ?? (await Member.find({ guild: message.guild!, member: args[0] }));
            if (!member) throw new Error(locale.interaction.member.notFound);
            if (!member.bannable) throw new Error(locale.command.ban.interaction.isNotBannable);
            return member;
        }
    },
    DAYS: {
        name: 'days',
        isFlag: true,
        required: false,
        description: locale.command.ban.usage.days.description,
        example: locale.command.ban.usage.days.example,
        filter(message, args, locale) {
            const days = getValuesFromStringFlag(args, ['--days', '-d']);
            if (days) {
                if (Number.isNaN(days))
                    throw new Error(locale.command.ban.error.mustBeNumber);
                else if (Number(days) > 7 || Number(days) < 1)
                    throw new Error(locale.command.ban.error.numberMustBeBetweenTwoValues);
            }
            return days;
        }
    },
    REASON: {
        name: 'reason',
        isFlag: true,
        required: false,
        description: locale.command.ban.usage.reason.description,
        example: locale.command.ban.usage.reason.example,
        filter(message, args, locale) {
            const reason = getValuesFromStringFlag(args, ['--reason', '-r']);
            return reason;
        }
    }
}

export const getHowToUse = () => {
    const command = '{bot.prefix}ban'
    const { DAYS, MEMBER, REASON } = argument;
    const howToUse = `${command} \\[@${MEMBER.name}|memberID\\]* (${DAYS.name} "Number") (${REASON.name} "Text")`;
    return MD.codeBlock.line(howToUse);
}

export default argument;