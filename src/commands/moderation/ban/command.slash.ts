import { ExecuteSlashCommand } from "../../index.types";
import argument from "./command.args";
import guildBanMember from './banMember.func';
import { GuildMember } from "discord.js";
import listBannedMembers from "./listBannedMembers.func";

const slashCommand: ExecuteSlashCommand = async (interaction, options) => {
    const subCommand = interaction.options.getSubcommand();

    switch (subCommand) {
        case argument.MEMBER.name:
            const banMember = interaction.options.getMember(argument.TARGET_MEMBER.name, argument.MEMBER.required) as GuildMember;
            const days = interaction.options.getNumber(argument.DAYS.name, argument.DAYS.required);
            const reason = interaction.options.getString(argument.REASON.name, argument.REASON.required);

            const answer = await guildBanMember({
                interaction,
                options: { ...options, banMember, days, reason, ephemeral: true }
            });
            return answer;
        case argument.LIST.name:
            return await listBannedMembers({ interaction, options, ephemeral: true });
    }
}

export default slashCommand;