import { MessageEmbed, User } from "discord.js";
import { BotCommand } from "../commands/index.types";
import { DiscordBot } from "../config";

export type CreateCommandBotLogParamAction = {
    embedMessage?: MessageEmbed;
    userInput?: string;
    subCommand?: string;
    customParams?: { [key: string]: any }
}

export type CreateLogParams = {
    member: User;
    logChannelId?: string;
    embedColor: number;
    command: BotCommand;
    action: CreateCommandBotLogParamAction;
}

export async function createCommandBotLog(params: CreateLogParams) {
    try {
        if (!params.logChannelId) return;
        const channel = DiscordBot.Client.get().channels.cache.get(params.logChannelId) ?? await DiscordBot.Client.get().channels.fetch(params.logChannelId, { cache: true });
        if (channel?.isText()) {
            const avatarUrl = params.member.avatarURL();
            const embed = new MessageEmbed({
                ...avatarUrl ? { url: avatarUrl } : {},
                title: `[${params.command.category}] ${params.command.name} ${params.action.subCommand ?? ''}`,
                description: params.action.userInput,
                color: params.embedColor,
                fields: [{ name: `👤 ${params.member.tag}`, value: `<@${params.member.id}>`, inline: false }],
                ...avatarUrl ? { thumbnail: { url: avatarUrl } } : {},
            });
            await channel.send({ embeds: [...params.action.embedMessage ? [params.action.embedMessage] : [], embed] });
        }
    } catch (error) {
        console.error('src/utils/createBotLog', error);
    }
}