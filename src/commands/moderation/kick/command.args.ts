import Member from "../../../application/Member";
import { createFilter } from "../../argument.utils";

import type { BotArgumentFunc } from "../../index.types";

const argument: Record<'MEMBER' | 'REASON', BotArgumentFunc> = {
    MEMBER: (options) => ({
        name: 'member',
        description: options.locale.usage.argument.member.description,
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
        required: false,
        filter: createFilter(options, (message, args) => {
            if (args[1]) return args.splice(1).join(' ');
        })
    })
}

export default argument;