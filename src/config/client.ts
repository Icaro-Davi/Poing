import Discord, { IntentsBitField, Partials } from 'discord.js';
import { DiscordBot } from '.';
import startListeningEvents from '../events';

import type { ClientEvents, Awaitable } from 'discord.js';
class Client {

    private static client: Discord.Client = new Discord.Client({
        intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildMessages,
            IntentsBitField.Flags.GuildMembers,
            IntentsBitField.Flags.GuildPresences,
            IntentsBitField.Flags.GuildModeration,
            IntentsBitField.Flags.GuildEmojisAndStickers,
            IntentsBitField.Flags.GuildMessageReactions,
            IntentsBitField.Flags.MessageContent
        ],
        partials: [
            Partials.Channel,
            Partials.Message,
            Partials.Reaction
        ]
    });

    static async start() {
        startListeningEvents();
        await DiscordBot.Database.start();
        await DiscordBot.LocaleMemory.loadLocales();
        await this.client.login(process.env.BOT_TOKEN);
        DiscordBot.Command.start();
    }

    static get = () => this.client;

    static on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaitable<void>) {
        this.client.on(event, listener);
    }
}

export default Client;