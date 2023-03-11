import { BaseMessageComponentOptions, Interaction, Message, MessageActionRow, MessageActionRowOptions, MessageEmbed } from "discord.js";

export type AnswerMemberParams = {
    content: {
        embeds?: MessageEmbed[];
        components?: (MessageActionRow | (Required<BaseMessageComponentOptions> & MessageActionRowOptions))[];
        content?: string;
        ephemeral?: boolean;
    };
}

type AnswerMemberInteraction = AnswerMemberParams & {
    interaction?: Interaction;
    options?: {
        editReply?: boolean;
    }
}

type AnswerMemberMessage = AnswerMemberParams & {
    message?: Message;
    options?: {
        editReply?: boolean;
    }
}

type AnswerMember = AnswerMemberInteraction | AnswerMemberMessage;
async function AnswerMember(params: AnswerMember) {
    if ('message' in params && params.message) {
        if (params.message?.editable && params.options?.editReply) {
            return await params.message.edit(params.content);
        }
        return await params.message?.reply(params.content);
    }
    if ('interaction' in params && params.interaction) {
        if (!params.interaction?.isRepliable()) return;
        if (params.options?.editReply && (params.interaction.deferred || params.interaction.replied)) {
            return await params.interaction.editReply(params.content);
        }
        return await params.interaction.reply({ ...params.content, fetchReply: true });
    }
}

export default AnswerMember;