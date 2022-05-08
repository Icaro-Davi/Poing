import { Guild, GuildMember } from "discord.js";
import { MemberApplication } from "../../../application";
import { PM } from "../../../components/messageEmbed";
import { ExecuteCommandOptions } from "../../index.types";

type SendDirectMessageType = {
    guild: Guild;
    member?: string;
    options: ExecuteCommandOptions;
    anonymousMessage: string;
    ephemeral?: boolean;
    mention?: GuildMember;
}

export const sendDirectMessage = async ({ guild, member, mention, anonymousMessage, options, ephemeral = false }: SendDirectMessageType) => {
    const guildMember = mention ?? (member ? await MemberApplication.find({ guild, member }) : undefined);
    if (guildMember) {
        const resultMessage = await guildMember.send({ embeds: [PM.normalMessage(anonymousMessage, guild, options)] } || '');
        if (resultMessage) {
            return { content: '🕵️‍♂️🤫', ephemeral };
        }
        else return { content: options.locale.interaction.cannotSendPrivateMessage, ephemeral };
    }
    return { content: options.locale.interaction.member.notFound, ephemeral };
}