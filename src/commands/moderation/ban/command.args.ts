import Member from "../../../application/Member";
import getValuesFromStringFlag from "../../../utils/regex/getValuesFromStringFlag";
import { createFilter } from "../../argument.utils";
import { middleware } from "../../command.middleware";
import type { BotArgumentFunc, ExecuteCommandOptions } from "../../index.types";

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

const getArgs = (options: ExecuteCommandOptions) => {
    const args = {
        DAYS: argument.DAYS(options),
        LIST: argument.LIST(options),
        REASON: argument.REASON(options),
        MEMBER: argument.MEMBER(options),
        TARGET_MEMBER: argument.TARGET_MEMBER(options),
        SOFT_BAN: argument.SOFT(options)
    }
    return args;
}

export const argMiddleware = middleware.createGetArgument(
    async function (message, args, options, next) {
        const arg = getArgs(options);
        const banMember = args.get(arg.MEMBER.name);
        const list = args.get(arg.LIST.name);
        const softBan = args.get(arg.SOFT_BAN.name);
        const days = args.get(argument.DAYS(options).name);
        const reason = args.get(argument.REASON(options).name);
        options.context.argument = {
            isSoftBan: !!softBan,
            isBan: !!banMember,
            isList: !!list,
            subCommand: (() => {
                if (list) return arg.LIST.name;
                if (softBan) return arg.SOFT_BAN.name;
                return '';
            })()
        }
        options.context.data = { banMember, days, reason };
        next();
    },
    async function (interaction, options, next) {
        const subCommand = interaction.options.getSubcommand();
        const args = getArgs(options);
        options.context.argument = {
            subCommand,
            isSoftBan: subCommand === args.SOFT_BAN.name,
            isList: subCommand === args.LIST.name,
            isBan: subCommand === args.MEMBER.name
        }
        if (options.context.argument.isBan || options.context.argument.isSoftBan) {
            const banMember = interaction.options.getMember(args.TARGET_MEMBER.name);
            const days = interaction.options.getNumber(args.DAYS.name, args.DAYS.required);
            const reason = interaction.options.getString(args.REASON.name, args.REASON.required);
            options.context.data = { banMember, days, reason };
        }
        next();
    }
)