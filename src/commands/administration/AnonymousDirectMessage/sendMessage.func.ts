import { CommandInteraction, GuildMember, Message } from "discord.js";
import { MemberApplication } from "../../../application";
import { PM } from "../../../components/messageEmbed";
import { ExecuteCommandOptions } from "../../index.types";

type SendDirectMessageType = {
    member?: string;
    options: ExecuteCommandOptions;
    anonymousMessage: string;
    mention?: GuildMember;
    message?: Message;
    interaction?: CommandInteraction;
    onError(message: string): void;
    onFinish(): void;
}

export const sendDirectMessage = async ({ member, mention, anonymousMessage, options, message, interaction, onError, onFinish }: SendDirectMessageType) => {
    if (!message && !interaction) throw new Error('Needs Message or Interaction to use this!');

    const guild = (message?.guild ?? interaction?.guild)!;
    const guildMember = mention ?? (member ? await MemberApplication.find({ guild, member }) : undefined);

    if (guildMember) {
        const resultMessage = await guildMember.send({ embeds: [PM.normalMessage(anonymousMessage, guild, options)] } || '');
        if (resultMessage) await onFinish();
        else return onError(options.locale.interaction.cannotSendPrivateMessage);
    } else onError(options.locale.interaction.member.notFound);
}