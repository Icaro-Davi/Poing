import { ColorResolvable, MessageEmbed } from "discord.js";
import { Locale } from "../../locale";

type options = {
    botColor: ColorResolvable;
    guildName: string;
    iconUrl: string;
    locale: Locale;
    reason?: string;
}

const messageToBanishedMember = ({ botColor, guildName, iconUrl, locale, reason }: options) => {
    return new MessageEmbed()
        .setColor(botColor)
        .setAuthor({ name: guildName || '', iconURL: iconUrl || '' })
        .setTitle(locale.messageEmbed.messageToBanishedMember.title)
        .setFields([{ name: locale.messageEmbed.messageToBanishedMember.fieldReason, value: reason || locale.messageEmbed.messageToBanishedMember.banWithoutReason }])
}

export default messageToBanishedMember;