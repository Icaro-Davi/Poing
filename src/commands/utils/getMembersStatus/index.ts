import slashCommandMiddleware from './command.slash';
import commandMiddleware from './command.default';
import type { BotCommandFunc } from '../../index.types';
import { middleware } from '../../command.middleware';

const command: BotCommandFunc = ({ locale }) => ({
    name: 'get-members-status',
    howToUse: '{bot.prefix}get-members-status',
    category: locale.category.utility,
    description: locale.command.getMembersStatus.description,
    aliases: ['gms', 'guildMembers'],
    commandPipeline: [commandMiddleware, middleware.submitLog('COMMAND')],
    slashCommandPipeline: [slashCommandMiddleware, middleware.submitLog('COMMAND_INTERACTION')]
});

export default command;
