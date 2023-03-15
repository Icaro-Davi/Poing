import { CommandInteraction, DiscordAPIError, Message } from "discord.js";
import { replaceValuesInString } from "../../../utils/replaceValues";
import { ExecuteCommandOptions } from "../../index.types";

type UnbanMemberOptions = {
    bannedMemberID: string;
    options: ExecuteCommandOptions;
    reason?: string;
    message?: Message
    interaction?: CommandInteraction;
    onError(message: string): void;
    onFinish(message: string): void;
}

const unbanMember = async ({ bannedMemberID, options, reason, message, interaction, onError, onFinish }: UnbanMemberOptions) => {
    if (!message && !interaction)
        throw new Error('Needs Message or Interaction to use this.');
    if (Number.isNaN(Number(bannedMemberID)))
        return onError(options.locale.interaction.onlyNumbers);

    const guild = (message?.guild ?? interaction?.guild)!;
    const author = (interaction?.user ?? message?.member?.user)!;

    const memberBanned = await guild.bans.fetch(bannedMemberID)
        .catch(err => {
            if (err instanceof DiscordAPIError)
                if (err.code === 10026) return onError(options.locale.interaction.member.notFound);
            throw err;
        });
    if (!memberBanned) return;

    const user = await guild.bans.remove(memberBanned.user, reason);
    if (!user)
        return onError(options.locale.command.unban.interaction.cantUnban);

    await onFinish(replaceValuesInString(options.locale.command.unban.interaction.memberUnbaned, {
        unbanedMember: user, authorMention: `<@${author.id}>`
    }));
}

export default unbanMember;