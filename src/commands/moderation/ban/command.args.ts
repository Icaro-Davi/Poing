import Member from "../../../application/Member";
import getValuesFromStringFlag from "../../../utils/regex/getValuesFromStringFlag";
import { createFilter } from "../../argument.utils";

import type { BotArgumentFunc } from "../../index.types";

const argument: Record<'MEMBER' | 'DAYS' | 'REASON' | 'LIST' | 'TARGET_MEMBER', BotArgumentFunc> = {
    MEMBER: (options) => ({
        name: 'member',
        required: false,
        description: options.locale.usage.argument.member.description,
        filter: createFilter(options, async (message, args) => {
            if (args[0]) {
                const member = message.mentions.members?.first() ?? (await Member.find({ guild: message.guild!, member: args[0] }));
                if (member) return member;
            }
        })
    }),
    LIST: (options) => ({
        name: 'list',
        required: false,
        description: options.locale.command.ban.usage.list.description,
        filter: createFilter(options, (_, args) => {
            if (args[0] && args[0].toLocaleLowerCase() === 'list') {
                return true
            }
        })
    }),
    DAYS: (options) => ({
        name: 'days',
        isFlag: true,
        required: false,
        description: options.locale.command.ban.usage.days.description,
        filter: createFilter(options, (_, args) => {
            const days = getValuesFromStringFlag(args, ['--days', '-d']);
            if (days) {
                if (Number.isNaN(days))
                    throw new Error(options.locale.command.ban.error.mustBeNumber);
                else if (Number(days) > 7 || Number(days) < 1)
                    throw new Error(options.locale.command.ban.error.numberMustBeBetweenTwoValues);
            }
            return days;
        })
    }),
    REASON: (options) => ({
        name: 'reason',
        isFlag: true,
        required: false,
        description: options.locale.command.ban.usage.reason.description,
        filter: createFilter(options, (_, args) => {
            const reason = getValuesFromStringFlag(args, ['--reason', '-r']);
            return reason;
        })
    }),
    TARGET_MEMBER: ({ locale }) => ({
        name: 'target',
        description: locale.usage.argument.member.description,
        required: true
    })
}

export default argument;