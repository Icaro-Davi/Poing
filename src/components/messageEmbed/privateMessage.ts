import { ColorResolvable, Guild, MessageEmbed } from "discord.js"
import { ExecuteCommandOptions } from "../../commands"
import { Locale } from "../../locale";

type options = {
    botColor: ColorResolvable;
    guildName: string;
    iconUrl: string;
    locale: Locale;
    reason?: string;
}

const normalMessage = (message: string, guild: Guild, option: ExecuteCommandOptions) => {
    return new MessageEmbed()
        .setColor(option.bot.hexColor)
        .setTitle(option.locale.messageEmbed.privateMessage.title)
        .setDescription(message)
        .setThumbnail(guild.iconURL() || '')
        .setFooter({ text: `${option.locale.messageEmbed.privateMessage.footer} ${guild.name}` })
        .setURL(`https://discord.com/channels/${guild.id}`)
}

const toBanishedMember = ({ botColor, guildName, iconUrl, locale, reason }: options) => {
    return new MessageEmbed()
        .setColor(botColor)
        .setAuthor({ name: guildName || '', iconURL: iconUrl || '' })
        .setTitle(locale.messageEmbed.messageToBanishedMember.title)
        .setFields([{ name: locale.messageEmbed.messageToBanishedMember.fieldReason, value: reason || locale.messageEmbed.messageToBanishedMember.banWithoutReason }])
}

const toKickedMember = ({ botColor, guildName, iconUrl, locale, reason }: options) => {
    return new MessageEmbed()
        .setColor(botColor)
        .setAuthor({ name: guildName || '', iconURL: iconUrl || '' })
        .setTitle(locale.messageEmbed.messageToBanishedMember.title)
        .setFields([{ name: locale.messageEmbed.messageToBanishedMember.fieldReason, value: reason || locale.messageEmbed.messageToBanishedMember.banWithoutReason }])
}

export default {
    toBanishedMember,
    toKickedMember,
    normalMessage,
};