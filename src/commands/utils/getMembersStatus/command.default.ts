import { ExecuteCommand } from "../../index.types";
import getMembersStatus from "./getMembersStatus.func";

const execDefault: ExecuteCommand = async (message, args, options) => {
    if (!message.guild) return;

    const answer = await getMembersStatus(message.guild, options);
    return { content: answer, type: 'embed' };
}

export default execDefault;