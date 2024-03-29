import { EmbedBuilder, Guild } from "discord.js";
import MD from "../../../utils/md";
import { ExecuteCommandOptions } from "../../index.types";

const getMembersStatus = async (guild: Guild, options: ExecuteCommandOptions) => {

    const membersStatusCount = (await guild.members.fetch())?.toJSON()
        .reduce<{ [key: string]: number }>((prev, member) => {
            if (member.presence?.status) {
                prev[member.presence.status] ? prev[member.presence.status] += 1 : prev[member.presence.status] = 1;
            } else {
                prev['offline'] ? prev['offline'] += 1 : prev['offline'] = 1;
            }
            return prev;
        }, {});

    let onlineMemberText = `${MD.bold.b(`:green_circle: ${options.locale.status.online}:`)} ${membersStatusCount?.online || 0}`;
    let idleMemberText = `${MD.bold.b(`:yellow_circle: ${options.locale.status.idle}:`)} ${membersStatusCount?.idle || 0}`;
    let dndMemberText = `${MD.bold.b(`:red_circle: ${options.locale.status.dnd}:`)} ${membersStatusCount?.dnd || 0}`;
    let offlineMemberText = `${MD.bold.b(`:white_circle: ${options.locale.status.offline}:`)} ${membersStatusCount?.offline || 0}`;
    let totalMemberText = `${MD.bold.b(`:blue_circle: ${options.locale.interaction.member.total}:`)} ${guild.memberCount || 0}`;

    return new EmbedBuilder()
        .setColor(options.bot.hexColor)
        .setTitle(options.locale.messageEmbed.memberStatus.title)
        .setDescription(`${onlineMemberText}\n${idleMemberText}\n${dndMemberText}\n${offlineMemberText}\n${totalMemberText}`);
}

export default getMembersStatus;