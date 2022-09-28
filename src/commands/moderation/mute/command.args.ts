import moment from "moment";
import Member from "../../../application/Member";
import MD from "../../../utils/md";
import { replaceValuesInString  } from "../../../utils/replaceValues";

import type { Role } from "discord.js";
import type { BotArgumentFunc } from "../../index.types";
import { createFilter } from "../../argument.utils";

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