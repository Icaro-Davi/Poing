import { EmbedBuilder } from 'discord.js';
import { replaceValuesInString  } from '../../utils/replaceValues';

import type { BotCommand, ExecuteCommandOptions } from '../../commands/index.types';

const createGetHelp = (command: BotCommand, options: ExecuteCommandOptions): EmbedBuilder => {
    return new EmbedBuilder()
        .setColor(options.bot.hexColor)
        .setTitle(`:dividers: ${replaceValuesInString('{messageEmbed.getHelp.title}', options.locale)} ${options.bot.prefix}${command.name}`)
        .setDescription(command.description)
        .setFooter({ text: `${replaceValuesInString('{category.label}', options.locale)} - ${command.category}` });
}

export default createGetHelp;