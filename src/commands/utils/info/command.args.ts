import { BotArgument } from "../../index.types";
import locale from '../../../locale/example.locale.json';
import Member from "../../../application/Member";
import MD from "../../../utils/md";

const argument: Record<'MEMBER' | 'TARGET_MEMBER', BotArgument> = {
    MEMBER: {
        name: 'member',
        description: locale.usage.argument.member.description,
        required: false,
        example: locale.command.info.usage.exampleMember,
        async filter(message, args, locale) {
            if (!args[1]) return;
            const member = message.mentions.members?.first() ?? await Member.find({ guild: message.guild!, member: args[1] });
            return member;
        }
    },
    TARGET_MEMBER: {
        name: 'target',
        description: locale.usage.argument.member.description,
        required: true,
    }
}

export const getHowToUse = () => {
    const command = '{bot.prefix}info';
    const howToUse = `
        ${MD.codeBlock.line(`${command} member \\[@Member|MemberID\\]*`)}
    `.trim();
    return howToUse;
}

export default argument;