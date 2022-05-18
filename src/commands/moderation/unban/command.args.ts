import { BotArgument } from "../../index.types";
import locale from '../../../locale/example.locale.json';
import MD from "../../../utils/md";

const argument: Record<'MEMBER' | 'REASON', BotArgument> = {
    MEMBER: {
        name: 'member',
        required: true,
        description: locale.command.unban.usage.member.description,
        example: locale.command.unban.usage.member.example,
        async filter(message, args, locale) {
            if (Number.isNaN(args[0])) return;
            return args[0];
        }
    },
    REASON: {
        name: 'reason',
        required: false,
        description: locale.usage.argument.reason.description,
        example: locale.command.unban.usage.reasonExample,
        filter(message, args, locale) {
            if (args[1]) return args.slice(1).join(' ');
        }
    }
}

export const getHowToUse = () => {
    const command = '{bot.prefix}unban';
    const howToUse = `
    ${MD.codeBlock.line(`${command} \\[MemberID\\]* (${argument.REASON.name})`)}
    `.trim();
    return howToUse;
}

export default argument;