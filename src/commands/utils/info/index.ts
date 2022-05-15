import { BotCommand } from '../../index.types';
import locale from '../../../locale/example.locale.json';
import argument, { getHowToUse } from './command.args';
import execDefaultCommand from './command.default';
import execSlashCommand from './command.slash';

const command: BotCommand = {
    name: 'info',
    howToUse: getHowToUse(),
    category: locale.category.utility,
    description: locale.command.info.description,
    usage: [
        [argument.MEMBER],
    ],
    slashCommand: [
        {
            ...argument.MEMBER,
            description: ` \\[${locale.category.utility}\\] ${argument.MEMBER.description}`,
            type: 'SUB_COMMAND',
            options: [{ ...argument.TARGET_MEMBER, type: 'USER' }]
        }
    ],
    execSlash: execSlashCommand,
    execDefault: execDefaultCommand
}

export default command;