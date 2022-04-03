import Discord from 'discord.js';
import startListeningEvents from '../events';

class Client {
    private static client: Discord.Client;
    static start = () => {
        startListeningEvents();
        this.client.login(process.env.BOT_TOKEN);
    }
    static get = () => this.client;
    static set = (client: Discord.Client) => { this.client = client; }
}

export default Client;