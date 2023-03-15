import { createFilter } from "../../argument.utils";
import { middleware } from "../../command.middleware";
import { BotArgumentFunc, ExecuteCommandOptions } from "../../index.types";

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

const getArgs = (options: ExecuteCommandOptions) => ({
    MEMBER: argument.MEMBER(options),
    REASON: argument.REASON(options)
});

export const argMiddleware = middleware.createGetArgument(
    async function (message, args, options, next) {
        const arg = getArgs(options);
        const member = args.get(arg.MEMBER.name);
        const reason = args.get(arg.REASON.name);
        options.context.data = { member, reason };
        next();
    },
    async function (interaction, options, next) {
        const arg = getArgs(options);
        const member = interaction.options.getNumber(arg.MEMBER.name, arg.MEMBER.required)?.toString();
        const reason = interaction.options.getString(arg.REASON.name, arg.REASON.required);
        options.context.data = { member, reason };
        next();
    }
);