import { Interaction, Message, MessageActionRow, MessageEmbed } from "discord.js";

type AnswerMemberParams = {
    content: {
        embeds?: MessageEmbed[];
        components?: MessageActionRow[];
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

async function AnswerMember(params: AnswerMemberInteraction | AnswerMemberMessage) {
    if ('message' in params) {
        if (params.message?.editable && params.options?.editReply) {
            return await params.message.edit(params.content);
        }
        return await params.message?.reply(params.content);
    }
    if ('interaction' in params) {
        if (!params.interaction?.isRepliable()) return;
        if (params.options?.editReply) {
            return await params.interaction.editReply(params.content);
        }
        return await params.interaction.reply(params.content);
    }
}

export default AnswerMember;