import { MessageEmbed } from 'discord.js';
import { BotCommand, BotArguments } from '../../commands';
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

const createGetHelp = (command: BotCommand, customPrefix = process.env.BOT_PREFIX): MessageEmbed => {
    const allArgs = command.usage?.reduce((prev, current) => [...prev, ...current], []);
    return new MessageEmbed()
        .setColor(`#${process.env.BOT_MESSAGE_EMBED_HEX_COLOR}`)
        .setTitle(`:dividers: Help command ${customPrefix}${command.name}`)
        .setDescription(command.description)
        .setFields([
            {
                name: ':paperclip: How to use',
                value: MD.codeBlock.line(`${customPrefix}${command.name} ${command.usage ? generateHowToUse(command.usage) : ''}`)
            },
            ...command.aliases
                ? [{ name: ':paperclip: Aliases', value: generateAliases(command.aliases, customPrefix || '') }]
                : [],
            ...allArgs
                ? [{ name: ':paperclip: Arguments', value: generateArguments([...allArgs].reverse()) },]
                : [],
            ...allArgs?.some(arg => arg.example)
                ? [{ name: ':paperclip: Examples', value: generateExamples(allArgs, customPrefix) }]
                : []
        ])
        .setFooter({ text: `Category - ${command.category}` });
}

export default createGetHelp;