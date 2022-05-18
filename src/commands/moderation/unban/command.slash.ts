import { ExecuteSlashCommand } from "../../index.types";
import argument from "./command.args";
import unbanMember from "./unbanMember.func";

const execSlashCommand: ExecuteSlashCommand = async (interaction, options) => {
    const memberID = interaction.options.getString(argument.MEMBER.name, argument.MEMBER.required);
    const reason = interaction.options.getString(argument.REASON.name, argument.REASON.required) ?? undefined;

    return await unbanMember({
        reason, options,
        ephemeral: true,
        author: interaction.user,
        bannedMemberID: `${memberID}`,
        guild: interaction.guild!,
    });
}

export default execSlashCommand;