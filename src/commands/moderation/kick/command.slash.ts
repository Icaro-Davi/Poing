import { GuildMember } from "discord.js";
import { ExecuteSlashCommand } from "../../index.types";
import argument from "./command.args";
import kickMember from "./kickMember.func";

const execSlashCommand: ExecuteSlashCommand = async (interaction, options) => {
    const kickedMember = interaction.options.getMember(argument.MEMBER.name, argument.MEMBER.required) as GuildMember;
    const reason = interaction.options.getString(argument.REASON.name, argument.REASON.required) || undefined;

    return await kickMember({ kickedMember, options, interaction, reason, ephemeral: true });
}

export default execSlashCommand;