import { MessageEmbed } from "discord.js";
import { BotCommand } from "..";
import { replaceVarsInString } from "../../locale";
import locale from '../../locale/example.locale.json';

const command: BotCommand = {
    name: 'ping',
    category: locale.category.utility,
    description: locale.command.ping.description,
    aliases: ['p'],
    exec: async (message, args, options) => {
        const resultMessage = await message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(options.bot.hexColor)
                    .setTitle(':small_orange_diamond: Ping')
            ]
        });
        let clientPing = `${options.locale.command.ping.interaction.clientPing} ${resultMessage.createdTimestamp - message.createdTimestamp}ms`;
        let serverPing = replaceVarsInString(options.locale.command.ping.interaction.serverPing, { bot: { ...options.bot }, ping: { server: message.client.ws.ping } });
        resultMessage.edit({
            embeds: [
                new MessageEmbed()
                    .setColor(options.bot.hexColor)
                    .setTitle(':small_blue_diamond: Pong')
                    .setDescription(`${clientPing}\n${serverPing}`)
            ]
        });
    }
}

export default command;

