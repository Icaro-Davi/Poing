import argument from "./command.args";
import { sendDirectMessage } from "./sendMessage.func";

import type { ExecuteSlashCommand } from "../../index.types";

const slashCommand: ExecuteSlashCommand = async function (interaction, options) {
    const user = interaction.options.getUser(argument.MEMBER.name);
    const anonymousMessage = interaction.options.getString(argument.MESSAGE.name);

    if (!user) return;
    if (!anonymousMessage) return;

    const answer = await sendDirectMessage({
        anonymousMessage,
        mention: interaction.guild?.members.cache.find(member => member.id === user?.id),
        guild: interaction.guild!,
        options,
        ephemeral: true
    });

    return answer;
}

export default slashCommand;