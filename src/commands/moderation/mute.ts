import { Message } from "discord.js";
import moment from "moment";
import { BotCommand, ExecuteCommandOptions } from "..";
import { Member, Mute } from "../../application";
import { DiscordBot } from "../../config";
import MD from "../../utils/md";
import getValuesFromStringFlag from "../../utils/regex/getValuesFromStringFlag";

export const addMuteRole = async (message: Message, role: string, options: ExecuteCommandOptions) => {
    const guildRole = message.guild?.roles.cache.find(_role => _role.name === role || _role.id === role);
    if (!guildRole) return await message.reply('Role not found');
    if (await Mute.addRole(message.guildId!, role))
        return await message.reply('Role added');
    else await message.reply('cannot register role');
}

export const MuteGuildMember = async (message: Message, arg: string[], options: ExecuteCommandOptions) => {
    const mute = await Mute.getInfo(message.guildId!);
    if (!mute) return await message.reply('Need add a role');

    const mutedRole = await message.guild?.roles.cache.some(role => role.id === mute.roleId);
    if (!mutedRole) return await message.reply('Need register a role');

    const member = await Member.search(message, arg[0]);
    if (!member) return await message.reply(options.locale.interaction.member.notFound);
    if (member.permissions.has('ADMINISTRATOR')) return await message.reply('cannot ban, is admin');

    if (member.roles.cache.some(role => role.id === mute.roleId)) return await message.reply('This member already muted');

    let muteTime: number = 0;
    if (arg[1]) {
        const timeChar = arg[1].slice(-1);
        const timeArg = arg[1].slice(0, -1);
        if (Number.isNaN(Number(timeArg))) return await message.reply(`${options.locale.interaction.mustBeNumber} ${MD.codeBlock.line(timeArg)}`);
        switch (timeChar.toLocaleUpperCase()) {
            case 'D':
                if (parseInt(timeArg) > 365) return await message.reply('Cant more than 1 year');
                muteTime = moment.utc().add(parseInt(timeArg), 'days').valueOf();
                break;
            case 'H':
                if (parseInt(timeArg) > 24) return await message.reply(`${timeArg}H is more than 1 day, please use D.`);
                muteTime = moment.utc().add(parseInt(timeArg), 'hours').valueOf()
                break;
            case 'M':
                if (parseInt(timeArg) > 60) return await message.reply(`${timeArg}M is more than 1 hour, please use H.`);
                muteTime = moment.utc().add(parseInt(timeArg), 'minutes').valueOf();
                if ((muteTime - moment.utc().valueOf()) < DiscordBot.ScheduleEvent.getLoopTimeMs())
                    DiscordBot.ScheduleEvent.unmuteCountdown(message.guildId!, member.id, muteTime - moment.utc().valueOf());
                break;
            default:
                return await message.reply(`I cant understand ${timeArg}${timeChar}`);
        }
    }

    if (!!muteTime) Mute.addMember(message.guildId!, member.id, muteTime);
    return await member.roles.add(mute.roleId);
}

const command: BotCommand = {
    name: 'mute',
    category: '{category.moderation}',
    description: '{command.mute.description}',
    allowedPermissions: ['MUTE_MEMBERS'],
    usage: [
        [{
            required: true, arg: '{usage.member.arg}',
            description: '{usage.member.description}',
            example: '{command.mute.usage.exampleMember}'
        }, {
            required: false, arg: '-addrole',
            description: '{command.mute.usage.-addRole.description}',
            example: '{command.mute.usage.-addRole.example}'
        }],
        [{
            required: false, arg: 'time',
            description: '',
            example: ''
        }]
    ],
    exec: async (message, arg, options) => {
        const addRole = getValuesFromStringFlag(arg, ['-addrole', '--a']);
        if (addRole) return await addMuteRole(message, addRole, options);

        if (!Number.isNaN(Number(arg[0])) || message.mentions.users.first())
            return await MuteGuildMember(message, arg, options);
    }
}

export default command;