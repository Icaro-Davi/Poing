import Discord from 'discord.js';
import { DiscordBot } from '.';
import startListeningEvents from '../events';

class Client {
    private static client: Discord.Client;
    static async start() {        
        startListeningEvents();
        await DiscordBot.Database.start();
        await this.client.login(process.env.BOT_TOKEN);
    }
    static get = () => this.client;
    static set = (client: Discord.Client) => { this.client = client; }
}

export default Client;