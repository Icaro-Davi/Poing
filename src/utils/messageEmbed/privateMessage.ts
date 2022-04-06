import { Guild, MessageEmbed } from "discord.js"
import { ExecuteCommandOptions } from "../../commands"

const privateMessageEmbedForMember = (message: string, guild: Guild, option: ExecuteCommandOptions) => {
    return new MessageEmbed()
        .setColor(option.bot.hexColor)
        .setTitle(option.locale.messageEmbed.privateMessage.title)
        .setDescription(message)
        .setThumbnail(guild.iconURL() || '')
        .setFooter({ text: `${option.locale.messageEmbed.privateMessage.footer} ${guild.name}` })
        .setURL(`https://discord.com/channels/${guild.id}`)
}

export default privateMessageEmbedForMember;