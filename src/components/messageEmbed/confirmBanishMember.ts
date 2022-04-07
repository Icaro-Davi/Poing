import { ColorResolvable, GuildMember, MessageEmbed } from "discord.js"
import { Locale, replaceVarsInString } from "../../locale";
import MD from "../../utils/md";

type Options = {
    locale: Locale;
    reason?: string;
    days?: number;
    member: GuildMember;
    authorTag: string;
    authorUrl: string;
    botColor: ColorResolvable;
}

const confirmBanishMember = ({ locale, reason, member, days, authorTag, authorUrl, botColor }: Options) => {
    return new MessageEmbed()
        .setColor(botColor)
        .setAuthor({ name: authorTag, iconURL: authorUrl })
        .setTitle(MD.bold.b(locale.messageEmbed.confirmBanishMember.title))
        .setFields([
            { name: 'Tag', value: member.user.tag },
            { name: locale.messageEmbed.confirmBanishMember.fieldNameDays, value: replaceVarsInString(locale.messageEmbed.confirmBanishMember.fieldDays, { days: days || 0 }) },
            ...reason ? [{ name: locale.messageEmbed.confirmBanishMember.fieldReason, value: reason }] : []
        ])
        .setThumbnail(member.user?.avatarURL() || '')
}

export default confirmBanishMember;

