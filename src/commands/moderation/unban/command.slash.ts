import argument from "./command.args";
import unbanMember from "./unbanMember.func";

import type { ExecuteSlashCommand } from "../../index.types";

const execSlashCommand: ExecuteSlashCommand = async function (interaction, options) {
    const arg = {
        MEMBER: argument.MEMBER(options),
        REASON: argument.REASON(options)
    }
    const memberID = interaction.options.getString(arg.MEMBER.name, arg.MEMBER.required);
    const reason = interaction.options.getString(arg.REASON.name, arg.REASON.required) ?? undefined;

    return await unbanMember({
        reason, options,
        ephemeral: true,
        author: interaction.user,
        bannedMemberID: `${memberID}`,
        guild: interaction.guild!,
    });
}

export default execSlashCommand;