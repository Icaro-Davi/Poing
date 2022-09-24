import { MessageEmbed } from 'discord.js';
import { BotCommand, ExecuteCommandOptions } from '../../commands/index.types';
import { replaceVarsInString } from '../../locale';

const createGetHelp = (command: BotCommand, options: ExecuteCommandOptions): MessageEmbed => {
    return new MessageEmbed()
        .setColor(options.bot.hexColor)
        .setTitle(`:dividers: ${replaceVarsInString('{messageEmbed.getHelp.title}', options.locale)} ${options.bot.prefix}${command.name}`)
        .setDescription(command.description)
        .setFooter({ text: `${replaceVarsInString('{category.label}', options.locale)} - ${command.category}` });
}

export default createGetHelp;