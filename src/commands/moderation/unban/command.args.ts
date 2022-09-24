import { createFilter } from "../../argument.utils";
import { BotArgumentFunc } from "../../index.types";

const argument: Record<'MEMBER' | 'REASON', BotArgumentFunc> = {
    MEMBER: (options) => ({
        name: 'member',
        required: true,
        description: options.locale.command.unban.usage.member.description,
        filter: createFilter(options, function (message, args) {
            if (Number.isNaN(args[0])) return;
            return args[0];
        })
    }),
    REASON: (options) => ({
        name: 'reason',
        required: false,
        description: options.locale.usage.argument.reason.description,
        filter: createFilter(options, function (message, args) {
            if (args[1]) return args.slice(1).join(' ');
        })
    })
}

export default argument;