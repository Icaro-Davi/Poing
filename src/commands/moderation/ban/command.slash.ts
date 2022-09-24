import argument from "./command.args";
import guildBanMember from './banMember.func';
import listBannedMembers from "./listBannedMembers.func";

import type { GuildMember } from "discord.js";
import type { ExecuteSlashCommand } from "../../index.types";

const slashCommand: ExecuteSlashCommand = async function (interaction, options) {
    const subCommand = interaction.options.getSubcommand();
    const args = {
        DAYS: argument.DAYS(options),
        LIST: argument.LIST(options),
        REASON: argument.REASON(options),
        MEMBER: argument.MEMBER(options),
        TARGET_MEMBER: argument.TARGET_MEMBER(options),
    }
    switch (subCommand) {
        case args.MEMBER.name:
            const banMember = interaction.options.getMember(args.TARGET_MEMBER.name, args.MEMBER.required) as GuildMember;
            const days = interaction.options.getNumber(args.DAYS.name, args.DAYS.required);
            const reason = interaction.options.getString(args.REASON.name, args.REASON.required);

            const answer = await guildBanMember({
                interaction,
                options: { ...options, banMember, days, reason, ephemeral: true }
            });
            return answer;
        case args.LIST.name:
            return await listBannedMembers({ interaction, options, ephemeral: true });
    }
}

export default slashCommand;