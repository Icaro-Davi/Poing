import Member from "../../../application/Member";
import getValuesFromStringFlag from "../../../utils/regex/getValuesFromStringFlag";
import { createFilter } from "../../argument.utils";

import type { BotArgumentFunc } from "../../index.types";

const argument: Record<'MEMBER' | 'DAYS' | 'REASON' | 'LIST' | 'TARGET_MEMBER' | 'SOFT', BotArgumentFunc> = {
    MEMBER: (options) => ({
        name: 'member',
        required: false,
        description: options.locale.usage.argument.member.description,
        filter: createFilter(options, async (message, args) => {
            const memberId = args.find(arg => /^\d+$/.test(arg));
            if (memberId) {
                const member = await Member.find({ guild: message.guild!, member: memberId });
                if (member) return member;
            } else {
                return message.mentions.members?.first() ?? undefined;
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
    SOFT: (options) => ({
        name: 'soft',
        required: false,
        description: options.locale.command.ban.usage.soft_ban.description,
        filter: createFilter(options, (_, args) => {
            if (args[0] && args[0].toLocaleLowerCase() === 'soft') {
                return true;
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