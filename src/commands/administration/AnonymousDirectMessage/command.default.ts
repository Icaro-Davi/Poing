import { GuildMember } from "discord.js";
import { ExecuteCommand } from "../../index.types";
import { argument } from "./command.args";
import { sendDirectMessage } from "./sendMessage.func";

const defaultCommand: ExecuteCommand = async (message, args, options) => {
    if (Array.isArray(args)) return;

    const member = args.get(argument.MEMBER.name) as GuildMember;
    const anonymousMessage = args.get(argument.MESSAGE.name) as string;

    if (!anonymousMessage) return { content: options.locale.interaction.needArguments };

    const answer = await sendDirectMessage({
        options,
        mention: member,
        anonymousMessage: anonymousMessage,
        guild: message.guild!,
    });

    return answer;
}

export default defaultCommand;