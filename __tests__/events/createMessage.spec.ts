import { Message } from "discord.js";
import { DiscordBot } from "../../src/config";
import { itIsANormalMessage, searchBotCommand } from "../../src/events/messageCreate";
import { getAllBotCommands, splitCommandAndArgs } from "../../src/utils/commands";


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
        const botCommand = splitCommandAndArgs(message.content, '!');
        expect(botCommand.name).toBe('command');
        expect(botCommand.args).toBeInstanceOf(Array);
        expect(botCommand.args.length).toBe(2);
    });
    it('Should search a command', () => {
        DiscordBot.Commands.start();
        const commands = getAllBotCommands();

        const randomCommandNumber = Math.round(Math.random() * (1 - commands.clientCommands.size) + 1);
        const randomAliasesNumber = Math.round(Math.random() * (1 - commands.aliasesCommandsKey.size) + 1);

        const randomCommandKey = commands.clientCommands.keyAt(randomCommandNumber) as string;
        const randomAliasesKey = commands.clientCommands.keyAt(randomAliasesNumber) as string;

        const botCommand = searchBotCommand(randomCommandKey);
        expect(botCommand?.name).toBe(randomCommandKey);

        const aliasesCommand = searchBotCommand(randomAliasesKey);
        expect(aliasesCommand?.name).toBe(randomAliasesKey);
    });
}); 