import { MessageEmbed } from "discord.js";
import { BotCommand } from "..";
import MD from "../../utils/md";
import { createGetHelp } from '../../utils/messageEmbed';

const command: BotCommand = {
    name: 'ping',
    category: 'Utility',
    description: 'I will send you the time in milliseconds (ms) it takes me to reply to you.',
    aliases: ['p'],
    usage: [
        [{ required: false, arg: 'none', description: 'No need arguments', example: `${MD.codeBlock.line('{prefix}ping')} - return the time in milliseconds of my services.` }]
    ],
    getHelp: (customPrefix) => createGetHelp(command, customPrefix),
    exec: async (message, args) => {
        const resultMessage = await message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(`#${process.env.BOT_MESSAGE_EMBED_HEX_COLOR}`)
                    .setTitle(':small_orange_diamond: Ping')
            ]
        });
        let clientPing = `Your ping: ${resultMessage.createdTimestamp - message.createdTimestamp}ms`;
        let serverPing = `@${process.env.BOT_NAME} to server: ${message.client.ws.ping}ms`;
        resultMessage.edit({
            embeds: [
                new MessageEmbed()
                    .setColor(`#${process.env.BOT_MESSAGE_EMBED_HEX_COLOR}`)
                    .setTitle(':small_blue_diamond: Pong')
                    .setDescription(`${clientPing}\n${serverPing}`)
            ]
        });
    }
}

export default command;

