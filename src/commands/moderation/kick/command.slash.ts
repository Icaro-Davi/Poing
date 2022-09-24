import argument from "./command.args";
import kickMember from "./kickMember.func";

import type { GuildMember } from "discord.js";
import type { ExecuteSlashCommand } from "../../index.types";

const execSlashCommand: ExecuteSlashCommand = async function (interaction, options) {
    const kickedMember = interaction.options.getMember(argument.MEMBER.name, argument.MEMBER(options).required) as GuildMember;
    const reason = interaction.options.getString(argument.REASON.name, argument.REASON(options).required) || undefined;

    return await kickMember({ kickedMember, options, interaction, reason, ephemeral: true });
}

export default execSlashCommand;