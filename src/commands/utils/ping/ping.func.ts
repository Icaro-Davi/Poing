import { EmbedBuilder } from "discord.js";
import { replaceValuesInString } from "../../../utils/replaceValues";

import type { CommandInteraction, Message } from 'discord.js';
import type { RequireAtLeastOne } from "../../../utils/typescript.funcs";
import type { ExecuteCommandOptions } from "../../index.types";

type PingOptions = RequireAtLeastOne<{
    message: Message;
    interaction: CommandInteraction;
    options: ExecuteCommandOptions;
    ephemeral?: boolean;
}, 'interaction' | 'message'>

const replyPingEmbedMessage = (description: string, color: number) => new EmbedBuilder({ color, title: ':small_blue_diamond: Pong', description });

const ping = async ({ options, interaction, message, ephemeral }: PingOptions) => {
    const pingEmbedMessage = new EmbedBuilder({ color: options.bot.hexColor, title: ':small_orange_diamond: Ping' });
    const resultMessage = await (message ?? interaction)?.channel?.send({ embeds: [pingEmbedMessage] });

    let serverPing = replaceValuesInString(options.locale.command.ping.interaction.serverPing, { bot: { ...options.bot }, ping: { server: (message ?? interaction)?.client.ws.ping } });
    let clientPing: string = resultMessage ? `${options.locale.command.ping.interaction.clientPing} ${resultMessage.createdTimestamp - (message ? message.createdTimestamp : interaction?.createdTimestamp ?? 0)}ms` : '';

    if (message && resultMessage)
        await resultMessage.edit({ embeds: [replyPingEmbedMessage(`${clientPing}\n${serverPing}`, options.bot.hexColor)] });

    if (interaction && resultMessage) {
        await resultMessage?.delete();
        await interaction.reply({
            embeds: [replyPingEmbedMessage(`${clientPing}\n${serverPing}`, options.bot.hexColor)],
            ephemeral
        });
    }
}

export default ping;