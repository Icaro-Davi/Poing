import { ColorResolvable, CommandInteraction, Message, MessageEmbed } from "discord.js";
import { replaceVarsInString } from "../../../locale";
import { RequireAtLeastOne } from "../../../utils/typescript.funcs";
import { ExecuteCommandOptions } from "../../index.types";

type PingOptions = RequireAtLeastOne<{
    message: Message;
    interaction: CommandInteraction;
    options: ExecuteCommandOptions;
    ephemeral?: boolean;
}, 'interaction' | 'message'>

const replyPingEmbedMessage = (description: string, color: ColorResolvable) => new MessageEmbed({ color, title: ':small_blue_diamond: Pong', description });

const ping = async ({ options, interaction, message, ephemeral }: PingOptions) => {
    const pingEmbedMessage = new MessageEmbed({ color: options.bot.hexColor, title: ':small_orange_diamond: Ping' });
    const resultMessage = await (message ?? interaction)?.channel?.send({ embeds: [pingEmbedMessage] });

    let serverPing = replaceVarsInString(options.locale.command.ping.interaction.serverPing, { bot: { ...options.bot }, ping: { server: (message ?? interaction)?.client.ws.ping } });
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