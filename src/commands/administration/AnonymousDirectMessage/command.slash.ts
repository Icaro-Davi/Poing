import { GuildMember } from "discord.js";
import { ExecuteSlashCommand } from "../../index.types";
import { argument } from "./command.args";
import { sendDirectMessage } from "./sendMessage.func";

const slashCommand: ExecuteSlashCommand = async (interaction, options) => {
    const mention = interaction.options.getMentionable(argument.MEMBER.name) as GuildMember;
    const anonymousMessage = interaction.options.getString(argument.MESSAGE.name);

    if (!mention) return;
    if (!anonymousMessage) return;

    const answer = await sendDirectMessage({
        anonymousMessage,
        mention,
        guild: interaction.guild!,
        options,
        ephemeral: true
    });

    return answer;
}

export default slashCommand;