import { Client, Collection } from "discord.js";

import onReady from "./ready";

import { BotCommand } from "../commands";
import onMessageCreate from "./messageCreate";

const Listener = (client: Client, commands: Collection<string, BotCommand>) => {
    client.on('ready', () => onReady());
    client.on('messageCreate', (message) => onMessageCreate(message, commands));
}

export default Listener;