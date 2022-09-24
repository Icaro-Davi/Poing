import Member from "../../../application/Member";
import { createFilter } from "../../argument.utils";

import type { BotArgumentFunc } from "../../index.types";

const argument: Record<'MEMBER' | 'TARGET_MEMBER', BotArgumentFunc> = {
    MEMBER: (options) => ({
        name: 'member',
        description: options.locale.usage.argument.member.description,
        required: false,
        filter: createFilter(options, async function (message, args) {
            if (!args[1]) return;
            if (args[0] && args[0] === argument.MEMBER(options).name) {
                const member = message.mentions.members?.first() ?? await Member.find({ guild: message.guild!, member: args[1] });
                return member;
            }
        })
    }),
    TARGET_MEMBER: (options) => ({
        name: 'target',
        description: options.locale.usage.argument.member.description,
        required: true,
    })
}

export default argument;