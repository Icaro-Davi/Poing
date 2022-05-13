import { BotArgument } from "../../index.types";
import locale from '../../../locale/example.locale.json';
import Member from "../../../application/Member";
import moment from "moment";
import MD from "../../../utils/md";
import { Role } from "discord.js";
import { replaceVarsInString } from "../../../locale";

const argument: Record<'MEMBER' | 'ADD_ROLE' | 'LIST' | 'TIME' | 'REASON' | 'TARGET_MEMBER' | 'TARGET_ROLE', BotArgument> = {
    MEMBER: {
        name: 'member',
        required: false,
        description: locale.usage.argument.member.description,
        example: locale.command.mute.usage.exampleMember,
        async filter(message, args, locale) {
            const member = message.mentions.members?.first() ?? await Member.find({ guild: message.guild!, member: args[0] });
            if (!member) return;
            return member;
        }
    },
    ADD_ROLE: {
        name: 'addrole',
        required: false,
        description: locale.command.mute.usage.addRole.description,
        example: locale.command.mute.usage.addRole.example,
        filter(message, args, locale) {
            if (args[0].toLocaleLowerCase() === this.name.toLocaleLowerCase()) {
                if (!args[1]) throw new Error(locale.interaction.needArguments);
                const role: Role | undefined = message.mentions.roles.first()
                    || message.guild?.roles.cache.find(_role => _role.id === args[1] || _role.name === args.slice(1).join(' '));
                if (!role) throw new Error(locale.command.mute.interaction.roleNotFound);
                return role;
            };
        }
    },
    LIST: {
        name: 'list',
        required: false,
        description: locale.command.mute.usage.list.description,
        example: locale.command.mute.usage.list.example,
        filter(message, args, locale) {
            if (args[0].toLocaleLowerCase() === this.name.toLocaleLowerCase()) return true;
        }
    },
    TIME: {
        name: 'time',
        required: false,
        description: locale.usage.argument.time.description,
        example: locale.command.mute.usage.exampleTime,
        filter(message, args, locale, data) {
            const hasMember = data[argument.MEMBER.name]!!;
            if (hasMember && args[1] && args[1].match(/^[\d]+(?:D|M|H)$/gi)) {
                const timeChar = args[1].slice(-1);
                const timeArg = args[1].slice(0, -1);
                if (Number.isNaN(Number(timeArg))) throw new Error(`${locale.command.mute.interaction.mustBeNumber} ${MD.codeBlock.line(timeArg)}`);
                switch (timeChar.toLocaleUpperCase()) {
                    case 'D':
                        if (parseInt(timeArg) > 365) throw new Error(locale.command.mute.interaction.arg.time.day);
                        return moment.utc().add(parseInt(timeArg), 'days');
                    case 'H':
                        if (parseInt(timeArg) > 24) throw new Error(replaceVarsInString(locale.command.mute.interaction.arg.time.hour, { timeArg: `[${args[1]}]` }));
                        return moment.utc().add(parseInt(timeArg), 'hours');
                    case 'M':
                        if (parseInt(timeArg) > 60) throw new Error(replaceVarsInString(locale.command.mute.interaction.arg.time.minute, { timeArg: `[${args[1]}]` }));
                        return moment.utc().add(parseInt(timeArg), 'minutes');
                    default:
                        throw new Error(replaceVarsInString(locale.command.mute.interaction.arg.time.idk, { timeArg, timeChar }));
                }
            }
        }
    },
    REASON: {
        name: 'reason',
        required: false,
        description: locale.command.mute.usage.reason.description,
        example: locale.command.mute.usage.reason.example,
        filter(message, args, locale, data) {
            const hasMember = !!data[argument.MEMBER.name];
            const hasTime = !!data[argument.TIME.name];
            if (hasMember) {
                if (hasTime) return args.slice(2).join(' ');
                else return args.slice(1).join(' ');
            }
        }
    },
    TARGET_MEMBER: {
        name: 'target',
        description: locale.usage.argument.member.description,
        required: true,
    },
    TARGET_ROLE: {
        name: 'target',
        description: locale.command.mute.usage.addRole.description,
        required: true,
    },
}

export const getHowToUse = () => {
    const command = '{bot.prefix}mute';
    const { ADD_ROLE, LIST, MEMBER, TIME, REASON } = argument;
    const howToUse = `
    ${MD.codeBlock.line(`${command} \\[@${MEMBER.name}|memberID\\]* (${TIME.name}<M|H|D>) (${REASON.name})`)}
    ${MD.codeBlock.line(`${command} ${ADD_ROLE.name} \\[@Role|RoleID\\]*`)}
    ${MD.codeBlock.line(`${command} ${LIST.name}`)}
    `.trim()
    return howToUse;
}

export default argument;