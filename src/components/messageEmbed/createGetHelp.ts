import { MessageEmbed } from 'discord.js';
import { BotCommand, BotArgument, ExecuteCommandOptions } from '../../commands/index.types';
import { replaceVarsInString } from '../../locale';
import MD from '../../utils/md';

const createAsterisk = (isRequired: boolean) => isRequired ? '*' : '';
const createFlag = (isFlag: boolean, arg: string) => isFlag ? `[--${arg}|-${arg[0]}]` : `[${arg}]`

const generateArguments = (allArgsOneDepth: BotArgument[]) => {
    const createText = (arg: string, required: boolean, isFlag: boolean, description?: string) => {
        return `\n${MD.codeBlock.line(`${createFlag(isFlag, arg)}${createAsterisk(required)}`)}${description ? ' - ' + description : ''}`;
    }
    return allArgsOneDepth.reduce((prev, current) =>
        createText(current.name, current.required, current.isFlag!!, current.description) + prev, '');
}

const generateAliases = (aliases: string[], customPrefix: string) =>
    MD.bold.b(MD.codeBlock.line(aliases.map(aliases => `${customPrefix}${aliases}`).join(' - ')))

const generateExamples = (allArgsOneDepth: BotArgument[]) => {
    return allArgsOneDepth.reduce((prev, current) => current.example ? prev + `${current.example}\n` : prev, '');
}

const createGetHelp = (command: BotCommand, options: ExecuteCommandOptions): MessageEmbed => {
    const allArgs = command.usage?.reduce((prev, current) => [...prev, ...current], []);
    return new MessageEmbed()
        .setColor(options.bot.hexColor)
        .setTitle(`:dividers: ${replaceVarsInString('{messageEmbed.getHelp.title}', options.locale)} ${options.bot.prefix}${command.name}`)
        .setDescription(command.description)
        .setFields([
            { name: `:paperclip: ${replaceVarsInString('{messageEmbed.getHelp.fieldHowToUse}', options.locale)}`, value: command.howToUse },
            ...command.aliases
                ? [{ name: `:paperclip: ${replaceVarsInString('{messageEmbed.getHelp.fieldAliases}', options.locale)}`, value: generateAliases(command.aliases, options.bot.prefix || '') }]
                : [],
            ...allArgs
                ? [{ name: `:paperclip: ${replaceVarsInString('{messageEmbed.getHelp.fieldArguments}', options.locale)}`, value: generateArguments([...allArgs].reverse()) },]
                : [],
            ...allArgs?.some(arg => arg.example)
                ? [{ name: `:paperclip: ${replaceVarsInString('{messageEmbed.getHelp.fieldExamples}', options.locale)}`, value: generateExamples(allArgs) }]
                : []
        ])
        .setFooter({ text: `${replaceVarsInString('{category.label}', options.locale)} - ${command.category}` });
}

export default createGetHelp;