import { Message } from "discord.js";
import { itIsANormalMessage, splitArgs } from "../../src/commands/command.default";
import { DiscordBot } from "../../src/config";

describe('Event Create Message', () => {
    const message = ({
        author: {
            bot: false,
        },
        content: '',
    } as unknown) as Message;
    it('It should be a command', () => {
        message.content = '!userinfo';
        expect(itIsANormalMessage(message, '!')).toBeFalsy();
    });
    it('Should be a normal message or ignore bots message', () => {
        message.content = 'This is a normal message from any user';
        expect(itIsANormalMessage(message, '!')).toBeTruthy();
        message.author.bot = true;
        expect(itIsANormalMessage(message, '!')).toBeTruthy();
    });
    it('Should remove prefix, cut message content and get command and list of arguments', () => {
        message.content = `!command arg1 arg2`;
        const botCommand = splitArgs(message.content, '!');
        expect(botCommand.name).toBe('command');
        expect(botCommand.args).toBeInstanceOf(Array);
        expect(botCommand.args.length).toBe(2);
    });
    it('Should search a command', () => {
        DiscordBot.Command.start();

        const randomCommandNumber = Math.round(Math.random() * (1 - DiscordBot.Command.Collection.size) + 1);
        const randomAliasesNumber = Math.round(Math.random() * (1 - DiscordBot.Command.AliasesCollection.size) + 1);

        const randomCommandKey = DiscordBot.Command.Collection.keyAt(randomCommandNumber) as string;
        const randomAliasesKey = DiscordBot.Command.AliasesCollection.keyAt(randomAliasesNumber) as string;

        const botCommand = DiscordBot.Command.search(randomCommandKey);
        expect(botCommand?.name).toBe(randomCommandKey);

        const commandByAliases = DiscordBot.Command.AliasesCollection.get(randomAliasesKey);
        expect(!!commandByAliases).toBeTruthy();

        if (commandByAliases) {
            const aliasesCommand = DiscordBot.Command.search(commandByAliases);
            expect(aliasesCommand && aliasesCommand.aliases && aliasesCommand.aliases.some(aliases => aliases === randomAliasesKey)).toBeTruthy();
        }
    });
});