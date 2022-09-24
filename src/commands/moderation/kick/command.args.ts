import Member from "../../../application/Member";
import { createFilter } from "../../argument.utils";

import type { BotArgumentFunc } from "../../index.types";

const argument: Record<'MEMBER' | 'REASON', BotArgumentFunc> = {
    MEMBER: (options) => ({
        name: 'member',
        description: options.locale.usage.argument.member.description,
        example: options.locale.command.kick.usage.memberExample,
        required: true,
        filter: createFilter(options, async (message, args) => {
            if (!args[0]) return;
            const member = message.mentions.members?.first() ?? await Member.find({ guild: message.guild!, member: args[0] })
            return member;
        })
    }),
    REASON: (options) => ({
        name: 'reason',
        description: options.locale.usage.argument.reason.description,
        example: options.locale.command.kick.usage.reasonExample,
        required: false,
        filter: createFilter(options, (message, args) => {
            if (args[1]) return args.splice(1).join(' ');
        })
    })
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