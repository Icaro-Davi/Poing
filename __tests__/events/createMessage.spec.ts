import { Message } from "discord.js";
import { findInMessageAValidPrefix, splitArgs } from "../../src/commands/command.default";
import { DiscordBot } from "../../src/config";
import LocaleMemory from "../../src/config/locale";

describe('Event Create Message', () => {
    const message = ({
        author: {
            bot: false,
        },
        mentions: {
            users: {
                first: () => undefined
            }
        },
        content: '',
    } as unknown) as Message;
    it('Should find a valid prefix', () => {
        message.content = '!info user';
        expect(findInMessageAValidPrefix(message, '!')).toBe('!');
    });
    it('Should be a invalid prefix', () => {
        message.content = '!info user';
        expect(findInMessageAValidPrefix(message, '#')).toBeUndefined();
    });
    it('Should be a normal message', () => {
        message.content = 'This is a normal message from any user';
        expect(findInMessageAValidPrefix(message, '!')).toBeUndefined();
    });
    it('Should remove prefix, cut message content and get command and list of arguments', () => {
        message.content = `!command arg1 arg2`;
        const botCommand = splitArgs(message.content, '!');
        expect(botCommand.name).toBe('command');
        expect(botCommand.args).toBeInstanceOf(Array);
        expect(botCommand.args.length).toBe(2);
    });
    it('Should search command by random name and aliases', async () => {
        await LocaleMemory.loadLocales().catch(err => {
            throw new Error(' Failed to load locales');
        })
        await DiscordBot.Command.start().catch(err => {
            throw new Error('Failed to load commands');
        });

        const randomCommandNumber = Math.round(Math.random() * (1 - DiscordBot.Command.Collection.size) + 1);
        const randomAliasesNumber = Math.round(Math.random() * (1 - DiscordBot.Command.AliasesCollection.size) + 1);

        const randomCommandKey = DiscordBot.Command.Collection.keyAt(randomCommandNumber) as string;
        const randomAliasesKey = DiscordBot.Command.AliasesCollection.keyAt(randomAliasesNumber) as string;

        const botCommand = DiscordBot.Command.search(randomCommandKey);
        if (!botCommand) throw new Error('Bot command undefined');

        expect(typeof botCommand).toBe('function');
        expect(botCommand({ locale: LocaleMemory.get('pt-BR') }).name).toBe(randomCommandKey);

        const commandByAliases = DiscordBot.Command.AliasesCollection.get(randomAliasesKey);
        expect(!!commandByAliases).toBeTruthy();

        if (commandByAliases) {
            const aliasesCommand = DiscordBot.Command.search(commandByAliases);
            expect(typeof aliasesCommand).toBe('function');
            const _aliasesCommand = aliasesCommand?.({ locale: LocaleMemory.get('pt-BR') });
            expect(_aliasesCommand && _aliasesCommand.aliases && _aliasesCommand.aliases.some((aliases: string) => aliases === randomAliasesKey)).toBeTruthy();
        }
    });
});