import getMembersStatus from "./getMembersStatus.func";
import { middleware } from "../../command.middleware";
import AnswerMember from "../../../utils/AnswerMember";

const execSlashCommand = middleware.create('COMMAND_INTERACTION', async function (interaction, options, next) {
    if (!interaction.guild) return;
    const embed = await getMembersStatus(interaction.guild, options);
    await AnswerMember({
        interaction, content: { embeds: [embed], ephemeral: true }
    });
    next();
});

export default execSlashCommand;