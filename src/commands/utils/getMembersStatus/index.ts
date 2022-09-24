import execSlashCommand from './command.slash';
import execDefaultCommand from './command.default';

import type { BotCommandFunc } from '../../index.types';

const command: BotCommandFunc = ({ locale }) => ({
    name: 'get-members-status',
    howToUse: '{bot.prefix}get-members-status',
    category: locale.category.utility,
    description: locale.command.getMembersStatus.description,
    aliases: ['gms', 'guildMembers'],
    execSlash: execSlashCommand,
    execDefault: execDefaultCommand
});

export default command;
