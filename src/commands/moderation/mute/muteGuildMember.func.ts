import { Guild, GuildMember, User } from "discord.js";
import moment from "moment";
import { MuteApplication } from "../../../application";
import { DiscordBot } from "../../../config";
import { ExecuteCommandOptions, ExecuteCommandReturn } from "../../index.types";

type MuteGuildMemberOptions = {
    guild: Guild;
    options: ExecuteCommandOptions;
    mutedMember: GuildMember;
    author: User;
    muteTime?: moment.Moment;
    reason?: string;
    ephemeral?: boolean;
};

export const MuteGuildMember = async ({ guild, options, mutedMember, muteTime, reason, author, ephemeral }: MuteGuildMemberOptions): ExecuteCommandReturn => {
    if (mutedMember && mutedMember.permissions.has('ADMINISTRATOR'))
        return { content: options.locale.command.mute.interaction.cannotMuteAdmin, ephemeral: true };

    const muteRoleId = await MuteApplication.getMuteRoleId(guild.id!);
    if (!muteRoleId) return { content: options.locale.command.mute.interaction.needMuteRoleId, ephemeral };

    const muteRole = await guild.roles.cache.find(role => role.id === muteRoleId);
    if (!muteRole) return { content: options.locale.command.mute.interaction.needRegisterRole, ephemeral };

    if (mutedMember.roles.cache.some(role => role.id === muteRole.id)) return { content: options.locale.command.mute.interaction.memberAlreadyMuted, ephemeral };

    if (muteTime) {
        const muteDoc = await MuteApplication.addMember(guild.id, mutedMember.id, moment(muteTime).toDate());
        if ((muteTime.valueOf() - moment.utc().valueOf()) < DiscordBot.ScheduleEvent.getLoopTimeMs())
            DiscordBot.ScheduleEvent.unmuteCountdown(muteDoc._id, guild.id, mutedMember.id, muteTime.valueOf() - moment.utc().valueOf());
    }

    await mutedMember.roles.add(muteRole, reason ? reason : undefined);

    return {
        content: `${options.locale.command.mute.interaction.mutedSuccessful}${reason ? `\n${options.locale.labels.reason}: \`${reason}\`` : ''} `,
        vars: {
            memberMutedName: `<@${mutedMember.id}>`,
            author: `<@${author.id}>`,
            duration: muteTime ? muteTime.locale(options.locale.localeLabel).fromNow() : '♾️',
        },
        ephemeral
    };
}