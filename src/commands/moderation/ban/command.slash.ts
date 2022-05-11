import { ExecuteSlashCommand } from "../../index.types";
import { argument } from "./command.args";
import guildBanMember from './banMember.func';

const slashCommand: ExecuteSlashCommand = async (interaction, options) => {
    const user = interaction.options.getUser(argument.MEMBER.name, argument.MEMBER.required);
    const banMember = interaction.guild?.members.cache.find(member => member.id === user?.id);
    if (!banMember?.bannable) return { content: options.locale.command.ban.interaction.isNotBannable, ephemeral: true };

    const days = interaction.options.getInteger(argument.DAYS.name, argument.DAYS.required);
    const reason = interaction.options.getString(argument.REASON.name, argument.REASON.required);

    const answer = await guildBanMember({
        interaction,
        options: { ...options, banMember, days, reason, ephemeral: true }
    });

    return answer;
}

export default slashCommand;