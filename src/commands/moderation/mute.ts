import { Message } from "discord.js";
import moment from "moment";
import { BotCommand, ExecuteCommandOptions } from "..";
import { Member } from "../../application";
import Guild from "../../application/guild";
import MD from "../../utils/md";
import getValuesFromStringFlag from "../../utils/regex/getValuesFromStringFlag";

export const addMuteRole = async (message: Message, role: string, options: ExecuteCommandOptions) => {
    const guildRole = message.guild?.roles.cache.find(_role => _role.name === role || _role.id === role);
    if (!guildRole) return await message.reply('Role not found');
    if (await Guild.addMuteRole(message.guildId!, role))
        return await message.reply('Role added');
    else await message.reply('cannot register role');
}

export const MuteGuildMember = async (message: Message, arg: string[], options: ExecuteCommandOptions) => {
    const mute = await Guild.getRoleMuteId(message.guildId!);
    if (!mute) return await message.reply('Need add a role');

    const mutedRole = await message.guild?.roles.cache.some(role => role.id === mute.roleId);
    if (!mutedRole) return await message.reply('Need register a role');

    const member = await Member.search(message, arg[0]);
    if (!member) return await message.reply(options.locale.interaction.member.notFound);
    if (member.permissions.has('ADMINISTRATOR')) return await message.reply('cannot ban, is admin');

    if (member.roles.cache.some(role => role.id === mute.roleId)) return await message.reply('This member already muted');

    if (arg[1]) {
        const timeChar = arg[1].slice(-1);
        if (Number.isNaN(Number(arg[1]))) return await message.reply(`${options.locale.interaction.mustBeNumber} ${MD.codeBlock.line(arg[1])}`);
        switch (timeChar) {
            case 'D':
                moment.utc().add(Number(arg[1]), 'days').toISOString();
                break;
            case 'H':
                moment.utc().add(Number(arg[1]), 'hours');
                break;
            case 'M':
                moment.utc().add(Number(arg[1]), 'minutes');
                break;
            default:
                return await message.reply(`I cant understand ${arg[1]}${timeChar}`);
        }
    }
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