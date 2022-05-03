import Discord, { Message, MessageEmbed, ReplyMessageOptions } from 'discord.js';
import path from 'path';
import { BotCommand } from '../commands';
import fs from 'fs';
import { replaceVarsInString } from '../locale';
import { MessageOptions } from 'child_process';

export type CommandHandler = {
    message: Message;
    vars: any;
    content?: string | MessageEmbed;
    type?: 'message' | 'embed';
    use?: 'reply' | 'send';
    ignore?: boolean;
}

class Commands {
    public static Collection: Discord.Collection<string, BotCommand>;
    public static AliasesCollection: Discord.Collection<string, string>;

    static start = () => {
        this.startPrefixCommands();
    }

    private static startPrefixCommands() {
        const { aliasesCommandsKey, clientCommands } = this.loadCommands();
        this.Collection = clientCommands;
        this.AliasesCollection = aliasesCommandsKey;
    }

    private static loadCommands() {
        const searchCommandsFiles = (dir: string, initialPath: string) => {
            const ignoreFiles = ['index.ts'];
            const getPaths = (path: string, paths: string[]) => {
                fs.readdirSync(path).forEach(file => {
                    if (fs.lstatSync(`${path}/${file}`).isFile() && !ignoreFiles.some(ignoreFile => ignoreFile.split('.')[0] === file.split('.')[0])) paths.push(`/${path}/${file}`);
                    if (fs.lstatSync(`${path}/${file}`).isDirectory()) return getPaths(`${path}/${file}`, paths);
                });
                return paths;
            }
            const commandPaths = getPaths(dir, []).map(_path => path.resolve(`${initialPath}/${_path.split('/').slice(2).join('/')}`));
            return commandPaths;
        }

        const clientCommands = new Discord.Collection<string, BotCommand>();
        const aliasesCommandsKey = new Discord.Collection<string, string>();
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

    static splitArgs(message: string, botPrefix: string) {
        const args = message.trim().slice(botPrefix.length || process.env.BOT_PREFIX!.length).split(/ +/);
        const name = args.shift()?.toLocaleLowerCase() || '';
        return { name, args }
    };

    static async handleMessage({ ignore, content, message, use = 'reply', type = 'message', vars }: CommandHandler) {
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

}

export default Commands;