import { DiscordBot } from "../config";
import { BotMute } from "../config/guildMemory";

type ListOfMutedMembers = { memberId: string; mutedTime: number; guildId: string }[];

class Mute {

    static getInfo(guildId: string) {
        try {
            return new Promise<BotMute>((res, rej) => {
                const guildRef = DiscordBot.GuildMemory.get(guildId);
                setTimeout(res, 200, guildRef.mute);
            });
        } catch (error) {
            // cannot search mute definitions.
            throw new Error('BOT_00002');
        }
    }

    static addRole(guildId: string, roleId: string) {
        try {
            return new Promise<boolean>((res, rej) => {
                const guildRef = DiscordBot.GuildMemory.get(guildId);
                DiscordBot.GuildMemory.update({ ...guildRef, mute: { ...guildRef.mute, roleId } });
                setTimeout(res, 200, true);
            });
        } catch (error) {
            // Cannot add mute role
            throw new Error('BOT_00003');
        }
    }

    static addMember(guildId: string, memberId: string, time: number) {
        try {
            return new Promise<boolean>((res, rej) => {
                const guildRef = DiscordBot.GuildMemory.get(guildId);
                DiscordBot.GuildMemory.update({
                    ...guildRef,
                    mute: {
                        ...guildRef.mute,
                        membersTimeout: [...guildRef.mute.membersTimeout, { memberId, mutedTime: time }]
                    }
                });
                setTimeout(res, 200, true);
            });
        } catch (error) {
            throw new Error('BOT_00004');
        }
    }

    static async unmute(guildId: string, memberId: string) {
        const guild = await DiscordBot.Client.get().guilds.fetch(guildId);
        if (!guild) throw new Error('BOT_00100');

        const member = guild.members.cache.find(member => member.id === memberId);
        const muteInfo = await this.getInfo(guildId);
        member?.roles.remove(muteInfo.roleId);
    }

    static findTimeoutAndUnmute(guildId: string, memberId: string) {
        return new Promise<boolean>(async (res, rej) => {
            const guildRef = DiscordBot.GuildMemory.get(guildId);
            const mutedMemberIndex = guildRef.mute.membersTimeout.findIndex(mutedMembers => mutedMembers.memberId === memberId);
            if (mutedMemberIndex > -1) {
                this.unmute(guildId, memberId);
                guildRef.mute.membersTimeout.splice(mutedMemberIndex, 1);
                DiscordBot.GuildMemory.update(guildRef);
                return res(true);
            }
            return res(false);
        });
    }

    static filterMutedMembersByTime(dateAsMS: number) {
        return Object.keys(DiscordBot.GuildMemory.getAll()).reduce<ListOfMutedMembers>((prev, key) =>
            [...prev, ...DiscordBot.GuildMemory.get(key).mute.membersTimeout.reduce<ListOfMutedMembers>((prev, current) =>
                (current.mutedTime < dateAsMS) ? [...prev, { ...current, guildId: key }] : prev
                , [])]
            , []);
    }

}

export default Mute;