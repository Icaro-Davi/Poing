import Discord from 'discord.js';
import path from 'path';
import fs from 'fs';
import { DiscordBot } from '.';
import { replaceValuesInString  } from '../utils/replaceValues';

import type { BotCommand, BotCommandFunc } from '../commands/index.types';
import type { Message, MessageEmbed, MessageOptions, ReplyMessageOptions, CommandInteraction, MessageComponent } from 'discord.js';

export type CommandHandler = {
    message: Message | CommandInteraction;
    vars: any;
    content?: string | MessageEmbed;
    type?: 'message' | 'embed';
    use?: 'reply' | 'send';
    ignore?: boolean;
    ephemeral?: boolean;
    components?: MessageComponent[];
}

class Commands {
    public static readonly Collection: Discord.Collection<string, BotCommandFunc> = new Discord.Collection<string, BotCommandFunc>();
    public static readonly AliasesCollection: Discord.Collection<string, string> = new Discord.Collection<string, string>();
    private static listOfFuncsToExecAfterCommandsLoad: Function[] = [];

    static start = async () => {
        await this.loadCommands();
        this.listOfFuncsToExecAfterCommandsLoad.forEach(fn => fn(this.Collection));
    }

    public static onLoad(cb: (commands: Discord.Collection<string, BotCommand>) => void) {
        if (cb) this.listOfFuncsToExecAfterCommandsLoad.push(cb);
    }

    static async loadSlashCommands() {
        const commands = DiscordBot.Client.get().application?.commands;
        const locale = DiscordBot.LocaleMemory.get('en-US');

        this.Collection.forEach(botCommand => {
            (async () => {
                const command = botCommand({ locale });
                if (!command.execSlash) return;
                const descriptionLength = 100 - command.category.length - 6;
                commands?.create({
                    name: command.name,
                    description: `[${command.category}] ${command.description.slice(0, descriptionLength)}${command.description.length > descriptionLength ? '...' : ''}`,
                    options: command?.slashCommand
                })
            })();
        });
    }

    private static searchCommandsFiles(dir: string) {
        const getPaths = (path: string, paths: string[]) => {
            fs.readdirSync(path).forEach(file => {
                if (file.match(/(?:\..+\.(?:t|j)?s)$/gi)) return;
                if (fs.lstatSync(`${path}/${file}`).isFile()) paths.push(`${path}/${file}`);
                if (fs.lstatSync(`${path}/${file}`).isDirectory()) return getPaths(`${path}/${file}`, paths);
            });
            return paths;
        }
        return getPaths(dir, []);
    }

    private static loadCommands() {
        const commandPaths = this.searchCommandsFiles(path.resolve(`${__dirname}/../commands`));
        return new Promise((resolve, reject) => {
            try {
                const locale = DiscordBot.LocaleMemory.get('en-US');
                for (const path of commandPaths) {
                    let command = require(path).default as BotCommandFunc;
                    const botCommand = command({ locale });
                    this.Collection.set(botCommand.name, command);
                    botCommand.aliases?.forEach(aliases => {
                        this.AliasesCollection.set(aliases, botCommand.name);
                    });
                }
                resolve(true);
            } catch (error) {
                console.log(error);
                reject(false);
            }
        });
    }

    static async handleMessage({ ignore, content, message, use = 'reply', type = 'message', vars, ephemeral, components }: CommandHandler) {
        if (ignore || !content) return;
        const exec = {
            send: message.channel?.send ? (m: any) => message.channel!.send(m) : (m: any) => { },
            reply: (m: any) => message.reply(m)
        }
        const _type = {
            embed: () => ({ embeds: [content], ephemeral, components }) as MessageOptions | ReplyMessageOptions,
            message: () => ({ content: replaceValuesInString(content as string, vars) || content, ephemeral, components })
        }
        await exec[use](_type[type]());
    }

    static search(commandName: string) {
        const commandFromAliases = this.AliasesCollection.get(commandName);
        return this.Collection.get(commandFromAliases || commandName);
    }

}

export default Commands;