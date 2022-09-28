import { MessageEmbed } from "discord.js"
import MD from "../../utils/md";
import { replaceValuesInString  } from "../../utils/replaceValues";

import type { ColorResolvable, GuildMember } from 'discord.js';
import type { Locale } from "../../locale";

type Options = {
    locale: Locale;
    reason?: string;
    days?: number;
    member: GuildMember;
    authorTag: string;
    authorUrl: string;
    botColor: ColorResolvable;
}

const banMember = ({ locale, reason, member, days, authorTag, authorUrl, botColor }: Options) => {
    return new MessageEmbed()
        .setColor(botColor)
        .setAuthor({ name: authorTag, iconURL: authorUrl })
        .setTitle(MD.bold.b(locale.messageEmbed.confirmBanishMember.title))
        .setFields([
            { name: 'Tag', value: member.user.tag },
            ...days ? [{ name: locale.messageEmbed.confirmBanishMember.fieldNameDays, value: replaceValuesInString(locale.messageEmbed.confirmBanishMember.fieldDays, { days: days }) }] : [],
            ...reason ? [{ name: locale.messageEmbed.confirmBanishMember.fieldReason, value: reason }] : []
        ])
        .setThumbnail(member.user?.avatarURL() || '')
}

const kickMember = ({ locale, reason, member, authorTag, authorUrl, botColor }: Omit<Options, 'days'>) => {
    return new MessageEmbed()
        .setColor(botColor)
        .setAuthor({ name: authorTag, iconURL: authorUrl })
        .setTitle(MD.bold.b(locale.messageEmbed.confirmKickMember.title))
        .setFields([
            { name: 'Tag', value: member.user.tag },
            ...reason ? [{ name: locale.messageEmbed.confirmKickMember.fieldReason, value: reason }] : []
        ])
        .setThumbnail(member.user?.avatarURL() || '')
}

export default {
    banMember,
    kickMember
};

