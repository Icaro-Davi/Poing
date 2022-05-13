import { BotCommand } from '../../index.types';
import locale from '../../../locale/example.locale.json';
import execSlashCommand from './command.slash';
import execDefaultCommand from './command.default';

const command: BotCommand = {
    name: 'get-members-status',
    howToUse: '{bot.prefix}get-members-status',
    category: locale.category.utility,
    description: locale.command.getMembersStatus.description,
    aliases: ['gms', 'guildMembers'],
    execSlash: execSlashCommand,
    execDefault: execDefaultCommand
}

export default command;
