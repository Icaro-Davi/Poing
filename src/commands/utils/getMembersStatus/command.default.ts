import getMembersStatus from "./getMembersStatus.func";

import type { ExecuteCommand } from "../../index.types";

const execDefaultCommand: ExecuteCommand = async function (message, args, options) {
    if (!message.guild) return;

    const answer = await getMembersStatus(message.guild, options);
    return { content: answer, type: 'embed' };
}

export default execDefaultCommand;