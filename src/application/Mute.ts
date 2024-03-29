import { Guild } from "discord.js";
import mongoose from "mongoose";
import { MemberApplication } from ".";
import { DiscordBot } from "../config";
import GuildRepository from "../domain/guild/GuildRepository";
import ScheduleUnmuteRepository from "../domain/schedule/unmute/ScheduleUnmuteRepository";

export type MutedMember = { name: string, timeout: Date }

class Mute {

    static async getMuteRoleId(guildId: string) {
        try {
            const guild = await GuildRepository.findByIdAndOmitValues(guildId, {
                bot: {
                    roles: { muteId: 1 }
                }
            });
            return guild?.bot?.roles?.muteId as string | undefined;
        } catch (error) {
            throw error;
        }
    }

    static async addRole(guildId: string, roleId: string) {
        try {
            await GuildRepository.update(guildId, { $set: { "bot.roles.muteId": roleId } });
            return true;
        } catch (error) {
            throw error;
        }
    }

    static async addMember(guildId: string, memberId: string, timeout: Date) {
        try {
            return await ScheduleUnmuteRepository.create({ guildId, memberId, timeout });
        } catch (error) {
            throw error;
        }
    }

    static async unmute(scheduleDocId: mongoose.Types.ObjectId, guildId: string, memberId: string) {
        const guildDoc = await GuildRepository.findByIdAndOmitValues(guildId, { bot: { roles: { muteId: 1 } } });
        if (!guildDoc?.bot?.roles) return false;

        const guild = DiscordBot.Client.get().guilds.cache.get(guildId) ?? await DiscordBot.Client.get().guilds.fetch(guildId);
        if (!guild) throw new Error('src.application.Mute.unmute guild not fount on try to unmute member');

        await ScheduleUnmuteRepository.delete(scheduleDocId);
        const member = await MemberApplication.find({ guild: guild, member: memberId });
        await member?.roles.remove(guildDoc.bot.roles.muteId);
    }

    static async findMutedMember(guildId: string, memberId: string) {
        return await ScheduleUnmuteRepository.findByGuildIdAndMemberId(guildId, memberId);
    }

    static async listMutedMembers(guild: Guild): Promise<MutedMember[]> {
        if (!guild.id) throw new Error('[needGuildId]');
        const docsOfMutedMembers = await ScheduleUnmuteRepository.listByGuildId(guild.id);
        const guildMutedMembers = docsOfMutedMembers.reduce((prev, current) => {
            const guildMember = guild.members.cache.get(current.memberId);
            guildMember ? prev.push({ name: guildMember.user.username ?? guildMember.nickname, timeout: current.timeout }) : undefined;
            return prev;
        }, [] as MutedMember[]);
        return guildMutedMembers;
    }

}

export default Mute;