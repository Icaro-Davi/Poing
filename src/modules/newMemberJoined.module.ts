import { MessageEmbed } from "discord.js";
import { ChannelApplication } from "../application";
import { DiscordBot } from "../config";

import type { GuildMember, TextChannel, MessageEmbedOptions } from "discord.js";
import type { IBotSchema } from "../domain/bot/Bot.schema";
import { replaceValuesInObject, replaceValuesInString } from "../utils/replaceValues";

type EmbedMessageOptionsType = {
    description: string;
    title?: string;
    author?: {
        name?: string;
        picture?: string;
    };
    fields?: { name: string; value: string, inline?: boolean }[];
    footer?: string;
    thumbnail?: string;
}

const createEmbedMessage = (embedMessageOptions: EmbedMessageOptionsType, vars: any) => {
    const embedMessageWithVars = replaceValuesInObject(embedMessageOptions, vars);
    const embedMessage: MessageEmbedOptions = Object.entries(embedMessageWithVars).reduce((prev, [key, value]: [string, any]) => {
        switch (key) {
            case 'thumbnail':
                return { ...prev, [key]: { url: value } };
            case 'footer':
                return { ...prev, [key]: { text: value } };
            case 'author':
                return { ...prev, [key]: { ...value, ...value?.picture ? { iconURL: value.picture } : {} } }
            default:
                return { ...prev, [key]: value };
        }
    }, {});
    return new MessageEmbed({
        ...embedMessage,
        color: vars.bot.hexColor,
    });
}

const welcomeNewGuildMember = async (member: GuildMember, guildConf: IBotSchema) => {
    const guild = member.guild;

    const vars = {
        bot: {
            ...DiscordBot.Bot.getDefaultVars()
        },
        guild: {
            name: guild.name,
            picture: guild.iconURL({ dynamic: true })
        },
        member: {
            username: member.user.username,
            tagNumber: member.user.discriminator,
            picture: member.displayAvatarURL(),
            mention: `<@${member.id}>`
        }
    }

    const channel = (guild.channels.cache.get('1234123121') || await ChannelApplication.getMainTextChannel(guild)) as TextChannel;

    const messageText = 'Welcome {member.mention}';
    const messageEmbed: EmbedMessageOptionsType = {
        title: `Bem vindo {member.username}`,
        author: { name: `{member.username}`, picture: '{member.picture}' },
        description: `Fique a vontade e leia as regras em {member.mention}`,
        fields: [
            {
                name: 'Ajuda no canal: {member.username}',
                value: `{member.mention}`,
                inline: true
            },
            {
                name: 'Regras em:',
                value: `<#${channel.id}>`,
                inline: true
            }
        ],
        footer: 'Divirta-se na guild',
        thumbnail: `{member.picture}`,
    }

    channel?.send(replaceValuesInString(messageText, vars));
    channel?.send({ content: vars.member.mention, embeds: [createEmbedMessage(messageEmbed, vars)] });
}

export default welcomeNewGuildMember;