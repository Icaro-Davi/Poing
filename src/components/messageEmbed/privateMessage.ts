import { EmbedBuilder } from "discord.js"
import { replaceValuesInString  } from "../../utils/replaceValues";

import type { ColorResolvable, Guild } from "discord.js"
import type { ExecuteCommandOptions } from "../../commands/index.types"
import type { Locale } from "../../locale";

type options = {
    botColor: ColorResolvable;
    guildName: string;
    iconUrl: string;
    locale: Locale;
    reason?: string;
}

const normalMessage = (message: string, guild: Guild, option: ExecuteCommandOptions) => {
    return new EmbedBuilder()
        .setColor(option.bot.hexColor)
        .setTitle(option.locale.messageEmbed.privateMessage.title.replace('{bot.name}', option.bot.name))
        .setDescription(replaceValuesInString(option.locale.messageEmbed.privateMessage.description, { message, guild: { name: `[${guild.name}](https://discord.com/channels/${guild.id})` } }))
        .setThumbnail(guild.iconURL() || '')
        .setFooter({ text: option.locale.messageEmbed.privateMessage.footer })
}

const toBanishedMember = ({ botColor, guildName, iconUrl, locale, reason }: options) => {
    return new EmbedBuilder()
        .setColor(botColor)
        .setAuthor({ name: guildName || '', iconURL: iconUrl || '' })
        .setTitle(locale.messageEmbed.messageToBanishedMember.title)
        .setFields([{ name: locale.messageEmbed.messageToBanishedMember.fieldReason, value: reason || locale.messageEmbed.messageToBanishedMember.banWithoutReason }])
}

const toKickedMember = ({ botColor, guildName, iconUrl, locale, reason }: options) => {
    return new EmbedBuilder()
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