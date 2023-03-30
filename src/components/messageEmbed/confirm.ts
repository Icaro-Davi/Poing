import { EmbedBuilder } from "discord.js";
import MD from "../../utils/md";
import { replaceValuesInString } from "../../utils/replaceValues";

import type { GuildMember } from 'discord.js';
import type { Locale } from "../../locale";

type Options = {
    locale: Locale;
    reason?: string;
    days?: number;
    member: GuildMember;
    authorTag: string;
    authorUrl: string;
    botColor: number;
}

const banMember = ({ locale, reason, member, days, authorTag, authorUrl, botColor }: Options) => {
    const thumbnail = member.user?.avatarURL();
    return new EmbedBuilder({
        color: botColor,
        author: { name: authorTag, iconURL: authorUrl },
        title: MD.bold.b(locale.messageEmbed.confirmBanishMember.title),
        fields: [
            { name: 'Tag', value: member.user.tag },
            ...days ? [{ name: locale.messageEmbed.confirmBanishMember.fieldNameDays, value: replaceValuesInString(locale.messageEmbed.confirmBanishMember.fieldDays, { days: days }) }] : [],
            ...reason ? [{ name: locale.messageEmbed.confirmBanishMember.fieldReason, value: reason }] : []
        ],
        ...thumbnail ? { thumbnail: { url: thumbnail } } : {}
    });
}

const kickMember = ({ locale, reason, member, authorTag, authorUrl, botColor }: Omit<Options, 'days'>) => {
    const thumbnail = member.user?.avatarURL();
    return new EmbedBuilder({
        color: botColor,
        author: { name: authorTag, iconURL: authorUrl },
        title: MD.bold.b(locale.messageEmbed.confirmKickMember.title),
        fields: [
            { name: 'Tag', value: member.user.tag },
            ...reason ? [{ name: locale.messageEmbed.confirmKickMember.fieldReason, value: reason }] : []
        ],
        ...thumbnail ? { thumbnail: { url: thumbnail } } : {}
    });
}

const softBanMember = ({ locale, botColor, authorTag, authorUrl, member }: Options) => {
    const thumbnail = member.user?.avatarURL();
    return new EmbedBuilder({
        color: botColor,
        author: { name: authorTag, iconURL: authorUrl },
        title: MD.bold.b(locale.messageEmbed.confirmSoftBan.title),
        description: locale.messageEmbed.confirmSoftBan.description,
        ...thumbnail ? { thumbnail: { url: thumbnail } } : {}
    });
}

export default {
    banMember,
    kickMember,
    softBanMember
};

