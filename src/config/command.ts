import Discord, { Message, MessageEmbed, MessageOptions, ReplyMessageOptions, CommandInteraction } from 'discord.js';
import path from 'path';
import { BotCommand } from '../commands/index.types';
import fs from 'fs';
import translateCommandToLocale, { replaceVarsInString } from '../locale';
import { DiscordBot } from '.';

export type CommandHandler = {
    message: Message | CommandInteraction;
    vars: any;
    content?: string | MessageEmbed;
    type?: 'message' | 'embed';
    use?: 'reply' | 'send';
    ignore?: boolean;
    ephemeral?: boolean;
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
            const getPaths = (path: string, paths: string[]) => {
                fs.readdirSync(path).forEach(file => {
                    if (file.match(/(?:\..+\.(?:t|j)?s)$/gi)) return;
                    if (fs.lstatSync(`${path}/${file}`).isFile()) paths.push(`/${path}/${file}`);
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

    static async loadSlashCommands() {
        const commands = DiscordBot.Client.get().application?.commands;
        this.Collection.forEach(botCommand => {
            (async () => {
                if (!botCommand.slashCommand) return;
                botCommand = (await translateCommandToLocale(botCommand, 'en-US')).botCommand;
                const descriptionLength = 100 - botCommand.category.length - 6;
                commands?.create({
                    name: botCommand.name,
                    description: `[${botCommand.category}] ${botCommand.description.slice(0, descriptionLength)}${botCommand.description.length > descriptionLength ? '...' : ''}`,
                    options: botCommand.slashCommand
                });
            })();
        });
    }

    static async handleMessage({ ignore, content, message, use = 'reply', type = 'message', vars, ephemeral }: CommandHandler) {
        if (ignore || !content) return;
        const exec = {
            send: message.channel?.send ? (a: any) => message.channel!.send(a) : (a: any) => { },
            reply: (a: any) => message.reply(a)
        }
        const _type = {
            embed: () => ({ embeds: [content], ephemeral }) as MessageOptions | ReplyMessageOptions,
            message: () => ({ content: replaceVarsInString(content as string, vars) || content, ephemeral })
        }
        await exec[use](_type[type]());
    }

    static search(commandName: string) {
        const commandFromAliases = this.AliasesCollection.get(commandName);
        return this.Collection.get(commandFromAliases || commandName);
    }

}

export default Commands;