import Discord from 'discord.js';
import { BotCommand } from '../commands';

class Commands {
    public static Collection: Discord.Collection<string, BotCommand>;
    public static AliasesCollection: Discord.Collection<string, string>;
    static setCollection = (commands: Discord.Collection<string, BotCommand>) => { this.Collection = commands; }
    static setAliases = (aliases: Discord.Collection<string, string>) => { this.AliasesCollection = aliases; }
}

export default Commands;