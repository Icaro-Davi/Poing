import argument from "./command.args";
import { sendDirectMessage } from "./sendMessage.func";

import type { GuildMember } from "discord.js";
import type { ExecuteCommand } from "../../index.types";

const defaultCommand: ExecuteCommand = async function (message, args, options) {
    const member = args.get(argument.MEMBER(options).name) as GuildMember;
    const anonymousMessage = args.get(argument.MESSAGE(options).name) as string;

    const answer = await sendDirectMessage({
        options,
        mention: member,
        anonymousMessage: anonymousMessage,
        guild: message.guild!,
    });

    return answer;
}

export default defaultCommand;