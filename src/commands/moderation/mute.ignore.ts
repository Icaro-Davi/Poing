import { Message } from "discord.js";
import moment, { Moment } from "moment";
import { BotCommand, ExecuteCommandOptions, ExecuteCommandReturn } from "../index.types";
import { MemberApplication, MuteApplication } from "../../application";
import { DiscordBot } from "../../config";
import MD from "../../utils/md";
import getValuesFromStringFlag from "../../utils/regex/getValuesFromStringFlag";
import locale from '../../locale/example.locale.json';
import Mute from "../../application/Mute";
import { list } from "../../components/messageEmbed";

export const addMuteRole = async (message: Message, role: string, options: ExecuteCommandOptions) => {
    const guildRole = message.mentions.roles.first() ?? message.guild?.roles.cache.find(_role => _role.name === role || _role.id === role);
    if (!guildRole) return options.locale.command.mute.interaction.roleNotFound;
    if (await MuteApplication.addRole(message.guildId!, guildRole.id))
        return options.locale.command.mute.interaction.muteRoleAdded;
    else return options.locale.command.mute.interaction.cannotRegisterRole;
}

export const MuteGuildMember = async (message: Message, arg: string[], options: ExecuteCommandOptions) => {
    const muteRoleId = await MuteApplication.getMuteRoleId(message.guildId!);
    if (!muteRoleId) return { content: options.locale.command.mute.interaction.needMuteRoleId };

    const muteRole = await message.guild?.roles.cache.find(role => role.id === muteRoleId);
    if (!muteRole) return { content: options.locale.command.mute.interaction.needRegisterRole };

    const member = await MemberApplication.search(message, arg[0]);
    if (!member) return { content: options.locale.interaction.member.notFound };
    if (member.permissions.has('ADMINISTRATOR')) return { content: options.locale.command.mute.interaction.cannotMuteAdmin };

    if (member.roles.cache.some(role => role.id === muteRole.id)) return { content: options.locale.command.mute.interaction.memberAlreadyMuted };

    let muteTime: Moment | undefined;
    if (arg[1] && arg[1].match(/^[\d]+(?:D|M|H)$/gi)) {
        const timeChar = arg[1].slice(-1);
        const timeArg = arg[1].slice(0, -1);
        if (Number.isNaN(Number(timeArg))) return { content: `${options.locale.interaction.mustBeNumber} ${MD.codeBlock.line(timeArg)}` };
        switch (timeChar.toLocaleUpperCase()) {
            case 'D':
                if (parseInt(timeArg) > 365) return { content: options.locale.command.mute.interaction.arg.time.day };
                muteTime = moment.utc().add(parseInt(timeArg), 'days');
                break;
            case 'H':
                if (parseInt(timeArg) > 24) return { content: options.locale.command.mute.interaction.arg.time.hour, vars: { timeArg } };
                muteTime = moment.utc().add(parseInt(timeArg), 'hours');
                break;
            case 'M':
                if (parseInt(timeArg) > 60) return { content: options.locale.command.mute.interaction.arg.time.minute, vars: { timeArg } };
                muteTime = moment.utc().add(parseInt(timeArg), 'minutes');
                break;
            default:
                return { content: options.locale.command.mute.interaction.arg.time.idk, vars: { timeArg, timeChar } };
        }
    }

    if (muteTime) {
        const muteDoc = await MuteApplication.addMember(message.guildId!, member.id, moment(muteTime).toDate());
        if ((muteTime.valueOf() - moment.utc().valueOf()) < DiscordBot.ScheduleEvent.getLoopTimeMs())
            DiscordBot.ScheduleEvent.unmuteCountdown(muteDoc._id, message.guildId!, member.id, muteTime.valueOf() - moment.utc().valueOf());
    }

    await member.roles.add(muteRole, muteTime ? arg.slice(2).join(' ').trim() : arg.slice(1).join(' ').trim() || 'No Reason');

    return {
        content: options.locale.command.mute.interaction.mutedSuccessful,
        vars: {
            memberMutedName: `<@${member.id}>`,
            author: `<@${message.author.id}>`,
            duration: muteTime ? muteTime.locale(options.locale.localeLabel).fromNow() : '♾️'
        }
    };
}

export const listMutedMembers = async (message: Message, options: ExecuteCommandOptions): ExecuteCommandReturn => {
    const membersMuted = await Mute.listMutedMembers(message);
    return { content: list.mutedMembers(membersMuted, options), type: 'embed' };
}

const command: BotCommand = {
    name: 'mute',
    category: locale.category.moderation,
    description: locale.command.mute.description,
    allowedPermissions: ['MUTE_MEMBERS'],
    usage: [
        [{
            required: true, name: locale.usage.argument.member.arg,
            description: locale.usage.argument.member.description,
            example: locale.command.mute.usage.exampleMember
        }, {
            required: false, name: '-addrole',
            description: locale.command.mute.usage['-addRole'].description,
            example: locale.command.mute.usage['-addRole'].example
        }, {
            required: false, name: '-list',
            description: locale.command.mute.usage['-list'].description,
            example: locale.command.mute.usage['-list'].example
        }],
        [{
            required: false, name: locale.usage.argument.time.arg,
            description: locale.usage.argument.time.description,
            example: locale.command.mute.usage.exampleTime
        }],
        [{
            required: false, name: locale.command.mute.usage.reason.arg,
            description: locale.command.mute.usage.reason.description,
            example: locale.command.mute.usage.reason.example
        }]
    ],
    execDefault: async (message, arg, options) => {
        const addRole = getValuesFromStringFlag(arg, ['-addrole', '--a']);
        if (addRole) return { content: await addMuteRole(message, addRole, options) };

        if (arg[0].toLocaleLowerCase() === '-list' || arg[0].toLocaleLowerCase() === '--l')
            return await listMutedMembers(message, options);

        if (!Number.isNaN(Number(arg[0])) || message.mentions.users.first())
            return await MuteGuildMember(message, arg, options);
    }
}

export default command;