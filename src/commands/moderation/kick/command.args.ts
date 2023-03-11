import Member from "../../../application/Member";
import { createFilter } from "../../argument.utils";
import { middleware } from "../../command.middleware";
import type { BotArgumentFunc, ExecuteCommandOptions } from "../../index.types";

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

const getArgs = (options: ExecuteCommandOptions) => ({
    MEMBER: argument.MEMBER(options),
    REASON: argument.REASON(options)
});

export const argMiddleware = middleware.createGetArgument(
    async function (message, args, options, next) {
        const arg = getArgs(options);
        const kickedMember = args.get(arg.MEMBER.name);
        const reason = args.get(arg.REASON.name);
        options.context.data = { kickedMember, reason };
        next();
    },
    async function (interaction, options, next) {
        const arg = getArgs(options);
        const kickedMember = interaction.options.getMember(arg.MEMBER.name, arg.MEMBER.required);
        const reason = interaction.options.getString(arg.REASON.name, arg.REASON.required);
        options.context.data = { kickedMember, reason };
        next();
    }
);