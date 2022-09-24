import Discord, { Intents } from 'discord.js';
import { DiscordBot } from '.';
import startListeningEvents from '../events';

class Client {

    private static client: Discord.Client = new Discord.Client({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.GUILD_PRESENCES,
            Intents.FLAGS.GUILD_BANS,
            Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS
        ],
    });

    static async start() {
        startListeningEvents();
        await DiscordBot.Database.start();
        await DiscordBot.LocaleMemory.loadLocales();
        await this.client.login(process.env.BOT_TOKEN);
        DiscordBot.Command.start();
    }

    static get = () => this.client;
}

export default Client;