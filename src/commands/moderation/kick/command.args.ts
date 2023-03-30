import Member from "../../../application/Member";
import { getFlagsFromUserInput } from "../../../utils/regex/getValuesFromStringFlag";
import { isMemberReference } from "../../../utils/regex/isMentionOrId";
import { createFilter } from "../../argument.utils";
import { middleware } from "../../command.middleware";
import type { BotArgumentFunc, ExecuteCommandOptions } from "../../index.types";

const argument: Record<'MEMBER' | 'REASON' | 'MASS' | 'TARGET_MEMBER', BotArgumentFunc> = {
    MASS: (options) => ({
        name: 'mass',
        description: 'Kick mass members',
        filter: createFilter(options, async (message, args, locale, data) => {
            return args[0] === 'mass';
        })
    }),
    MEMBER: (options) => ({
        name: 'member',
        description: options.locale.usage.argument.member.description,
        filter: createFilter(options, async (message, args, locale, data) => {
            if (!isMemberReference(args[0])) return;
            const member = (message.mentions.members?.first() ?? await Member.find({ guild: message.guild!, member: args[0] }));
            return member;
        })
    }),
    REASON: (options) => ({
        name: 'reason',
        description: options.locale.usage.argument.reason.description,
        filter: createFilter(options, (message, args, locale, data) => {
            if (!isMemberReference(args[0])) return;
            if (args[1]) return args.splice(1).join(' ');
        })
    }),
    TARGET_MEMBER: (options) => ({
        name: 'target',
        description: options.locale.usage.argument.member.description,
        required: true
    })
}

export default argument;

const getArgs = (options: ExecuteCommandOptions) => ({
    MEMBER: argument.MEMBER(options),
    MASS_KICK: argument.MASS(options),
    REASON: argument.REASON(options)
});

export const argMiddleware = middleware.createGetArgument(
    async function (message, args, options, next) {
        const arg = getArgs(options);
        const massKickFlags = args.get(arg.MASS_KICK.name);
        const kickedMember = args.get(arg.MEMBER.name);
        const reason = args.get(arg.REASON.name);

        options.context.argument = {
            isKick: !!kickedMember,
            isMassKick: !!massKickFlags,
            subCommand: (() => {
                if (massKickFlags) return arg.MASS_KICK.name;
                return '';
            })()
        }

        if (options.context.argument.isKick) {
            options.context.data = { kickedMember, reason };
        }

        next();
    },
    async function (interaction, options, next) {
        const arg = getArgs(options);
        const subCommand = interaction.options.getSubcommand();

        options.context.argument = {
            isKick: subCommand === arg.MEMBER.name,
            isMassKick: subCommand === arg.MASS_KICK.name,
            subCommand
        }

        if (options.context.argument.isKick) {
            const kickedMember = interaction.options.getMember(arg.MEMBER.name);
            const reason = interaction.options.getString(arg.REASON.name, arg.REASON.required);
            options.context.data = { kickedMember, reason };
        }

        next();
    }
);