import { Collection, Message } from "discord.js";
import { BotCommand } from "../commands";

import { splitCommandAndArgs } from "../utils/commands";

const onMessageCreate = (message: Message, commands: Collection<string, BotCommand>) => {
    if (!message.content.startsWith(process.env.BOT_DEFAULT_PREFIX || '!') || message.author.bot) return;
    const command = splitCommandAndArgs(message.content);
    const botCommand = commands.get(command.name);
    if (!botCommand) return;
    try {
        if (botCommand.minArgs && botCommand.maxArgs) {
            if (command.args.length < botCommand?.minArgs) { message.reply({ embeds: [botCommand.getDescription()] }); return; };
            if (command.args.length > botCommand?.maxArgs) { message.reply({ embeds: [botCommand.getDescription()] }); return; };
        }
        botCommand.exec(message, command.args);
    } catch (error) {
        console.error(error);
        message.reply(`Sorry, i think i have a bug in that command, i will try to kill it.`);
    }
}

export default onMessageCreate;