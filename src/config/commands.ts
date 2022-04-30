import Discord from 'discord.js';
import { BotCommand } from '../commands';
import { getAllBotCommands } from '../utils/commands';

class Commands {
    public static Collection: Discord.Collection<string, BotCommand>;
    public static AliasesCollection: Discord.Collection<string, string>;

    static start = () => {
        this.startPrefixCommands();
    }

    private static startPrefixCommands(){
        const { aliasesCommandsKey, clientCommands } = getAllBotCommands();
        this.Collection = clientCommands;
        this.AliasesCollection = aliasesCommandsKey;
    }

}

export default Commands;