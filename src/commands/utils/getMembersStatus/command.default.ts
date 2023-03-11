import { middleware } from "../../command.middleware";
import getMembersStatus from "./getMembersStatus.func";
import AnswerMember from "../../../utils/AnswerMember";

const execDefaultCommand = middleware.create('COMMAND', async function (message, args, options, next) {
    if (!message.guild) return;
    const embed = await getMembersStatus(message.guild, options);
    await AnswerMember({
        message, content: { embeds: [embed] }
    });
    next();
});

export default execDefaultCommand;