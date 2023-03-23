import { EmbedBuilder, GuildMember } from "discord.js";
import moment from "moment";
import Mute from "../../../application/Mute";
import MD from "../../../utils/md";
import { ExecuteCommandOptions } from "../../index.types";

const memberInfo = async (member: GuildMember, options: ExecuteCommandOptions, onFinish: (embed: EmbedBuilder) => void) => {
    const muteRoleId = await Mute.getMuteRoleId(member.guild.id);
    const mutedDoc = (muteRoleId && member.roles.cache.has(muteRoleId)) ? await Mute.findMutedMember(member.guild.id, member.id) : undefined;
    const userInfoEmbed = new EmbedBuilder()
        .setColor(options.bot.hexColor)
        .setTitle(`Tag ${member.user.tag}`)
        .addFields([
            ...member.nickname ? [{ name: options.locale.labels.nickname, value: member.nickname || '', inline: true }] : [],
            { name: 'Status', value: member.presence?.status ? options.locale.status[member.presence.status] : 'offline', inline: true },
            ...member.user.createdTimestamp ? [{ name: options.locale.labels.joinedDiscord, value: moment(member.user.createdTimestamp).locale(options.locale.localeLabel).fromNow(), inline: true }] : [],
            ...member.joinedAt ? [{ name: options.locale.labels.joinedServer, value: moment(member.joinedAt).locale(options.locale.localeLabel).fromNow(), inline: true }] : [],
            ...mutedDoc ? [{ name: options.locale.labels.unmute, value: moment(mutedDoc.timeout).locale(options.locale.localeLabel).fromNow(), inline: true }] : [],
            ...(!mutedDoc && muteRoleId) && member.roles.cache.has(muteRoleId) ? [{ name: options.locale.labels.muted, value: '♾️' }] : [],
            { name: 'ID', value: member.id },
            { name: options.locale.labels.roles, value: member.roles.cache.map((role, key, collection) => MD.codeBlock.line(`[${role.name}]`)).join(' ') }
        ])
        .setThumbnail(member.user.avatarURL() || '');

    await onFinish(userInfoEmbed);
}

export default memberInfo;