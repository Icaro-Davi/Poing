import { ChatInputCommandInteraction, GuildMember, Message, PermissionFlagsBits } from "discord.js";
import moment from "moment";
import { MuteApplication } from "../../../application";
import { DiscordBot } from "../../../config";
import AnswerMember from "../../../utils/AnswerMember";
import { replaceValuesInString } from "../../../utils/replaceValues";
import { ExecuteCommandOptions, ExecuteCommandReturn } from "../../index.types";
import createMutedRole from "./createMutedRole.func";

type MuteGuildMemberOptions = {
    options: ExecuteCommandOptions;
    mutedMember: GuildMember;
    muteTime?: moment.Moment;
    reason?: string;
    interaction?: ChatInputCommandInteraction;
    message?: Message;
    onError: () => void;
};

export const MuteGuildMember = async ({ options, mutedMember, muteTime, reason, message, interaction, onError }: MuteGuildMemberOptions): ExecuteCommandReturn => {
    const guild = (message?.guild ?? interaction?.guild)!;
    const author = (message?.author ?? interaction?.user)!;
    let messageStack = '';

    if (mutedMember && mutedMember.permissions.has(PermissionFlagsBits.Administrator)) {
        await AnswerMember({
            interaction, message,
            content: {
                content: options.locale.command.mute.interaction.cannotMuteAdmin,
                ephemeral: true
            }
        }); onError(); return;
    }

    const muteRoleId = await MuteApplication.getMuteRoleId(guild.id!);

    const muteRole = await (async () => {
        if (muteRoleId) {
            const muteRole = await guild.roles.cache.find(role => role.id === muteRoleId);
            if (muteRole) return muteRole;
        }
        const newRole = await createMutedRole(guild);
        await MuteApplication.addRole(guild.id, newRole.id);
        messageStack += replaceValuesInString(options.locale.command.mute.interaction.muteRoleCreated, {
            role: `<@&${newRole.id}>`
        });
        return newRole;
    })();

    if (!muteRole) {
        await AnswerMember({
            interaction, message,
            content: {
                content: options.locale.command.mute.interaction.needRegisterRole,
                ephemeral: true
            }
        }); onError(); return;
    };

    if (mutedMember.roles.cache.some(role => role.id === muteRole.id)) {
        await AnswerMember({
            interaction, message, content: {
                content: options.locale.command.mute.interaction.memberAlreadyMuted,
                ephemeral: true
            }
        }); onError(); return;
    };

    if (muteTime) {
        const muteDoc = await MuteApplication.addMember(guild.id, mutedMember.id, moment(muteTime).toDate());
        if (muteDoc && (muteTime.valueOf() - moment.utc().valueOf()) < DiscordBot.ScheduleEvent.getLoopTimeMs())
            DiscordBot.ScheduleEvent.unmuteCountdown(muteDoc._id, guild.id, mutedMember.id, muteTime.valueOf() - moment.utc().valueOf());
    }

    await mutedMember.roles.add(muteRole, reason ? reason : undefined);

    messageStack += `\n${options.locale.command.mute.interaction.mutedSuccessful}${reason ? `\n${options.locale.labels.reason}: \`${reason}\`` : ''} `;
    await AnswerMember({
        interaction, message,
        content: {
            content: replaceValuesInString(messageStack, {
                memberMutedName: `<@${mutedMember.id}>`,
                author: `<@${author.id}>`,
                duration: muteTime ? muteTime.locale(options.locale.localeLabel).fromNow() : '♾️',
            }),
            ephemeral: true
        }
    });
}