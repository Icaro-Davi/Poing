import { Types } from 'mongoose';
import { createMessage } from "./newMemberJoined.module";
import { ModulesApplication } from "../application";
import { createNewModule } from ".";

import type { IGuildSchema } from "../domain/guild/Guild.schema";
import type { GuildMember, PartialGuildMember } from "discord.js";

const memberLeave = async (member: GuildMember | PartialGuildMember, guildConf: Omit<IGuildSchema, "_id">) => {
    try {
        const moduleId: Types.ObjectId = guildConf.modules?.memberLeave?.settings as unknown as Types.ObjectId;
        if (Types.ObjectId.isValid(moduleId)) {
            const settings = await ModulesApplication.getMemberLeaveSettingsById(moduleId);
            const guild = member.guild;
            if (settings)
                await createMessage({
                    discordGuild: guild,
                    guildConf: guildConf as IGuildSchema,
                    guildMember: member,
                    moduleSettings: settings
                });
        }
    } catch (error) {
        console.error('[ERROR_MODULE_MEMBER_LEAVE] Error on src.modules.memberLeave.module \n', error);
    }
}

export default createNewModule('guildMemberRemove', memberLeave);