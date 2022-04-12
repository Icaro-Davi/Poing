import { config } from 'dotenv';
import { Message } from "discord.js";
import { itIsANormalMessage } from "../../src/events/messageCreate";
import { splitCommandAndArgs } from "../../src/utils/commands";

config();

describe('Event Create Message', () => {
    const message = ({
        author: {
            bot: false,
        },
        content: '',

    } as unknown) as Message;
    it('It should be a command', () => {
        message.content = '!userinfo';
        expect(itIsANormalMessage(message, '!')).toBe(false);
    });
    it('Should be a normal message or ignore bots message', () => {
        message.content = 'This is a normal message from any user';
        expect(itIsANormalMessage(message, '!')).toBeTruthy();
        message.author.bot = true;
        expect(itIsANormalMessage(message, '!')).toBeTruthy();
    });
    it('Should remove prefix, cut message content and get command and list of arguments', () => {
        message.content = `${process.env.BOT_PREFIX}command arg1 arg2`;
        const botCommand = splitCommandAndArgs(message.content);
        expect(botCommand.name).toBe('command');
        expect(botCommand.args).toBeInstanceOf(Array);
        expect(botCommand.args.length).toBe(2);
    });
}); 