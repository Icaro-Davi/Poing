import { MessageEmbed } from 'discord.js';
import { BotCommand, BotArguments, ExecuteCommandOptions } from '../../commands';
import { replaceVarsInString } from '../../locale';
import MD from '../md';

const createAsterisk = (isRequired: boolean) => isRequired ? '*' : '';

const generateArguments = (allArgsOneDepth: BotArguments) => {
    const createText = (arg: string, required: boolean, description?: string) => {
        return `\n${MD.codeBlock.line(`[${arg}]${createAsterisk(required)}`)}${description ? ' - ' + description : ''}`;
    }
    return allArgsOneDepth.reduce((prev, current) =>
        createText(current.arg, current.required, current.description) + prev, '');
}

const generateAliases = (aliases: string[], customPrefix: string) =>
    MD.bold.b(MD.codeBlock.line(aliases.map(aliases => `${customPrefix}${aliases}`).join(' - ')))

const generateHowToUse = (usage: BotArguments[]) => {
    const createArgumentByIndex = (options: { arg: string, currentIndex: number, lastIndex: number, required: boolean }) => {
        const formattedArg = `(${options.arg})${createAsterisk(options.required)}`;
        if (!options.lastIndex) return `[${formattedArg}] `;
        switch (options.currentIndex) {
            case 0:
                return `[${formattedArg}|`;
            case options.lastIndex:
                return `${formattedArg}] `;
            default:
                return `${formattedArg}|`;
        }
    }
    return usage.reduce((prev, current) => {
        return prev + current.reduce((_prev, _current, _index) =>
            _prev + createArgumentByIndex({ ..._current, currentIndex: _index, lastIndex: current.length - 1 })
            , '')
    }, '').trim();
}

const generateExamples = (allArgsOneDepth: BotArguments, customPrefix?: string) => {
    return allArgsOneDepth.reduce((prev, current) => current.example ? prev + `${current.example.replaceAll('{prefix}', customPrefix || '!')}\n` : prev, '');
}

const createGetHelp = (command: BotCommand, options: ExecuteCommandOptions): MessageEmbed => {
    const allArgs = command.usage?.reduce((prev, current) => [...prev, ...current], []);
    return new MessageEmbed()
        .setColor(`#${process.env.BOT_MESSAGE_EMBED_HEX_COLOR}`)
        .setTitle(`:dividers: ${replaceVarsInString('{messageEmbed.getHelp.title}', options.locale)} ${options.bot.prefix}${command.name}`)
        .setDescription(command.description)
        .setFields([
            {
                name: `:paperclip: ${replaceVarsInString('{messageEmbed.getHelp.fieldHowToUse}', options.locale)}`,
                value: MD.codeBlock.line(`${options.bot.prefix}${command.name} ${command.usage ? generateHowToUse(command.usage) : ''}`)
            },
            ...command.aliases
                ? [{ name: `:paperclip: ${replaceVarsInString('{messageEmbed.getHelp.fieldAliases}', options.locale)}`, value: generateAliases(command.aliases, options.bot.prefix || '') }]
                : [],
            ...allArgs
                ? [{ name: `:paperclip: ${replaceVarsInString('{messageEmbed.getHelp.fieldArguments}', options.locale)}`, value: generateArguments([...allArgs].reverse()) },]
                : [],
            ...allArgs?.some(arg => arg.example)
                ? [{ name: `:paperclip: ${replaceVarsInString('{messageEmbed.getHelp.fieldExamples}', options.locale)}`, value: generateExamples(allArgs, options.bot.prefix) }]
                : []
        ])
        .setFooter({ text: `${replaceVarsInString('{category.label}', options.locale)} - ${command.category}` });
}

export default createGetHelp;