import { Message } from "discord.js";
import mongoose from "mongoose";
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

        const guild = await DiscordBot.Client.get().guilds.fetch(guildId);
        if (!guild) throw new Error('BOT_00100');

        await ScheduleUnmuteRepository.delete(scheduleDocId);
        const member = guild.members.cache.find(member => member.id === memberId);
        await member?.roles.remove(guildDoc.bot.roles.muteId);
    }

    static async findMutedMember(guildId: string, memberId: string) {
        return await ScheduleUnmuteRepository.findByGuildIdAndMemberId(guildId, memberId);
    }

    static async listMutedMembers(message: Message): Promise<MutedMember[]> {
        if (!message.guildId) throw new Error('[needGuildId]');
        const docsOfMutedMembers = await ScheduleUnmuteRepository.listByGuildId(message.guildId);
        const guildMutedMembers = docsOfMutedMembers.reduce((prev, current) => {
            const guildMember = message.guild?.members.cache.get(current.memberId);
            guildMember ? prev.push({ name: guildMember.user.username ?? guildMember.nickname, timeout: current.timeout }) : undefined;
            return prev;
        }, [] as MutedMember[]);
        return guildMutedMembers;
    }

}

export default Mute;