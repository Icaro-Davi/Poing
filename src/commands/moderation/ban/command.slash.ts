import { GuildMember } from "discord.js";
import { ExecuteSlashCommand } from "../../index.types";
import { argument } from "./command.args";
import guildBanMember from './banMember.func';

const slashCommand: ExecuteSlashCommand = async (interaction, options) => {
    const banMember = interaction.options.getMentionable(argument.MEMBER.name, argument.MEMBER.required) as GuildMember;
    if (!banMember.bannable) return { content: options.locale.command.ban.interaction.isNotBannable, ephemeral: true };

    const days = interaction.options.getInteger(argument.DAYS.name, argument.DAYS.required);
    const reason = interaction.options.getString(argument.REASON.name, argument.REASON.required);

    const answer = await guildBanMember({
        interaction,
        options: { ...options, banMember, days, reason, ephemeral: true }
    });

    return answer;
}

export default slashCommand;