import DiscordJS, { Message, MessageEmbed, MessageOptions, ReplyMessageOptions } from 'discord.js';
import fs from 'fs';
import path from 'path';

import { BotCommand } from '../commands';
import { replaceVarsInString } from '../locale';

export const splitCommandAndArgs = (message: string, botPrefix: string) => {
    const args = message.trim().slice(botPrefix.length || process.env.BOT_PREFIX!.length).split(/ +/);
    const name = args.shift()?.toLocaleLowerCase() || '';
    return {
        name, args
    };
}

export const getAllBotCommands = () => {
    const clientCommands = new DiscordJS.Collection<string, BotCommand>();
    const aliasesCommandsKey = new DiscordJS.Collection<string, string>();
    const commandPaths = searchCommandsFiles(path.resolve(`${__dirname}/../commands`), path.resolve(`${__dirname}/../commands/`));

    for (const path of commandPaths) {
        const command = require(path).default as BotCommand;
        clientCommands.set(command.name, command);
        command.aliases?.forEach(aliases => {
            aliasesCommandsKey.set(aliases, command.name);
        });
    }
    return { clientCommands, aliasesCommandsKey };
}

export const searchCommandsFiles = (dir: string, returnWithInitialPath = './') => {
    const ignoreFiles = ['index.ts'];
    const getPaths = (path: string, paths: string[]) => {
        fs.readdirSync(path).forEach(file => {
            if (fs.lstatSync(`${path}/${file}`).isFile() && !ignoreFiles.some(ignoreFile => ignoreFile.split('.')[0] === file.split('.')[0])) paths.push(`/${path}/${file}`);
            if (fs.lstatSync(`${path}/${file}`).isDirectory()) return getPaths(`${path}/${file}`, paths);
        });
        return paths;
    }
    const commandPaths = getPaths(dir, []).map(_path => path.resolve(`${returnWithInitialPath}/${_path.split('/').slice(2).join('/')}`));
    return commandPaths;
}

export type CommandHandler = {
    message: Message;
    vars: any;
    content?: string | MessageEmbed;
    type?: 'message' | 'embed';
    use?: 'reply' | 'send';
    ignore?: boolean;
}

export const handleCommandsAfterExecution = async ({ ignore, content, message, type = 'message', use = 'reply', vars }: CommandHandler) => {
    if (ignore || !content) return;
    const exec = {
        send: (a: any) => message.channel.send(a),
        reply: (a: any) => message.reply(a)
    }
    const _type = {
        embed: () => ({ embeds: [content] }) as MessageOptions | ReplyMessageOptions,
        message: () => replaceVarsInString(content as string, vars) || content
    }
    await exec[use](_type[type]());
}