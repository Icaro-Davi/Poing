import moment from "moment";
import Member from "../../../application/Member";
import MD from "../../../utils/md";
import { replaceValuesInString } from "../../../utils/replaceValues";

import type { Role } from "discord.js";
import { createFilter } from "../../argument.utils";
import { middleware } from "../../command.middleware";
import type { BotArgumentFunc, ExecuteCommandOptions } from "../../index.types";

const argument: Record<'MEMBER' | 'ADD_ROLE' | 'LIST' | 'TIME' | 'REASON' | 'TARGET_MEMBER' | 'TARGET_ROLE', BotArgumentFunc> = {
    MEMBER: (options) => ({
        name: 'member',
        required: false,
        description: options.locale.usage.argument.member.description,
        filter: createFilter(options, async function (message, args) {
            if (!args[0]) return;
            const member = message.mentions.members?.first() ?? await Member.find({ guild: message.guild!, member: args[0] });
            return member;
        })
    }),
    ADD_ROLE: (options) => ({
        name: 'addrole',
        required: false,
        description: options.locale.command.mute.usage.addRole.description,
        filter: createFilter(options, function (message, args) {
            if (args[0] && args[0].toLocaleLowerCase() === argument.ADD_ROLE(options).name) {
                if (!args[1]) throw new Error(options.locale.interaction.needArguments);
                const role: Role | undefined = message.mentions.roles.first()
                    || message.guild?.roles.cache.find(_role => _role.id === args[1] || _role.name === args.slice(1).join(' '));
                if (!role) throw new Error(options.locale.command.mute.interaction.roleNotFound);
                return role;
            };
        })
    }),
    LIST: (options) => ({
        name: 'list',
        required: false,
        description: options.locale.command.mute.usage.list.description,
        filter: createFilter(options, function (message, args) {
            if (args[0] && args[0].toLocaleLowerCase() === 'list') return true;
        })
    }),
    TIME: (options) => ({
        name: 'time',
        required: false,
        description: options.locale.usage.argument.time.description,
        filter: createFilter(options, function (message, args, _, data) { // remove: _
            const hasMember = data[argument.MEMBER(options).name];
            if (hasMember && args[1] && args[1].match(/^[\d]+(?:D|M|H)$/gi)) {
                const timeChar = args[1].slice(-1);
                const timeArg = args[1].slice(0, -1);
                if (Number.isNaN(Number(timeArg))) throw new Error(`${options.locale.command.mute.interaction.mustBeNumber} ${MD.codeBlock.line(timeArg)}`);
                switch (timeChar.toLocaleUpperCase()) {
                    case 'D':
                        if (parseInt(timeArg) > 365) throw new Error(options.locale.command.mute.interaction.arg.time.day);
                        return moment.utc().add(parseInt(timeArg), 'days');
                    case 'H':
                        if (parseInt(timeArg) > 24) throw new Error(replaceValuesInString(options.locale.command.mute.interaction.arg.time.hour, { timeArg: `[${args[1]}]` }));
                        return moment.utc().add(parseInt(timeArg), 'hours');
                    case 'M':
                        if (parseInt(timeArg) > 60) throw new Error(replaceValuesInString(options.locale.command.mute.interaction.arg.time.minute, { timeArg: `[${args[1]}]` }));
                        return moment.utc().add(parseInt(timeArg), 'minutes');
                    default:
                        throw new Error(replaceValuesInString(options.locale.command.mute.interaction.arg.time.idk, { timeArg, timeChar }));
                }
            }
        })
    }),
    REASON: (options) => ({
        name: 'reason',
        required: false,
        description: options.locale.command.mute.usage.reason.description,
        filter: createFilter(options, function (message, args, locale, data) {
            const hasMember = !!data[argument.MEMBER(options).name];
            const hasTime = !!data[argument.TIME(options).name];
            if (hasMember) {
                if (hasTime) return args.slice(2).join(' ');
                else return args.slice(1).join(' ');
            }
        })
    }),
    TARGET_MEMBER: (options) => ({
        name: 'target',
        description: options.locale.usage.argument.member.description,
        required: true,
    }),
    TARGET_ROLE: (options) => ({
        name: 'target',
        description: options.locale.command.mute.usage.addRole.description,
        required: true,
    }),
}

export default argument;

const getArgs = (options: ExecuteCommandOptions) => ({
    ADD_ROLE: argument.ADD_ROLE(options),
    LIST: argument.LIST(options),
    MEMBER: argument.MEMBER(options),
    REASON: argument.REASON(options),
    TARGET_MEMBER: argument.TARGET_MEMBER(options),
    TARGET_ROLE: argument.TARGET_ROLE(options),
    TIME: argument.TIME(options),
});

export const argMiddleware = middleware.createGetArgument(
    async function (message, args, options, next) {
        const arg = getArgs(options);
        const member = args.get(arg.MEMBER.name);
        const muteRole = args.get(arg.ADD_ROLE.name);
        const list = args.get(arg.LIST.name);

        options.context.argument = {
            isAddRole: !!muteRole,
            isList: !!list,
            isMuteMember: !!member,
            subCommand: (() => {
                if (muteRole) return arg.ADD_ROLE.name;
                if (list) return arg.LIST.name;
                return '';
            })()
        }
        if (options.context.argument.isMuteMember) {
            const time = args.get(arg.TIME.name);
            const reason = args.get(arg.REASON.name);
            options.context.data = { member, time, reason };
        } else if (options.context.argument.isAddRole) {
            options.context.data = { role: muteRole };
        }
        next();
    },
    async function (interaction, options, next) {
        const arg = getArgs(options);
        const subCommand = interaction.options.getSubcommand();
        options.context.argument = {
            subCommand,
            isAddRole: subCommand === arg.ADD_ROLE.name,
            isList: subCommand === arg.LIST.name,
            isMuteMember: subCommand === arg.MEMBER.name,
        }
        if (options.context.argument.isMuteMember) {
            const member = interaction.options.getMember(arg.TARGET_MEMBER.name, true);
            const reason = interaction.options.getString(arg.REASON.name) as string;
            const muteTime = interaction.options.getString(arg.TIME.name);
            options.context.data = { target: member, reason, time: muteTime };
        } else if (options.context.argument.isAddRole) {
            const muteRole = interaction.options.getRole(arg.TARGET_ROLE.name, true);
            options.context.data = { target: muteRole };
        }
        next();
    }
)