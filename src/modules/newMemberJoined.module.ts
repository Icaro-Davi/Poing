import { MessageEmbed } from "discord.js";
import moment from "moment";
import { ChannelApplication, ModulesApplication } from "../application";
import { DiscordBot } from "../config";

import type { GuildMember, TextChannel, MessageEmbedOptions } from "discord.js";
import type { IBotSchema } from "../domain/bot/Bot.schema";
import { replaceValuesInObject, replaceValuesInString } from "../utils/replaceValues";
import { IGuildSchema } from "../domain/guild/Guild.schema";

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

const welcomeNewGuildMember = async (member: GuildMember, guildConf: Omit<IGuildSchema, '_id'>) => {
    const guild = member.guild;

    if (!guildConf?.modules?.welcomeMember?.settings) return;
    const settings = await ModulesApplication.getWelcomeSettingsById(guildConf.modules.welcomeMember.settings as unknown as string);

    const channel = (settings?.channelId
        ? guild.channels.cache.get(settings.channelId)
        : await ChannelApplication.getMainTextChannel(guild)) as TextChannel;

    const vars = {
        bot: {
            ...DiscordBot.Bot.getDefaultVars(),
            hexColor: guildConf.bot.messageEmbedHexColor || DiscordBot.Bot.defaultBotHexColor
        },
        guild: {
            name: guild.name,
            picture: guild.iconURL({ dynamic: true }),
            memberCount: guild.memberCount,
        },
        member: {
            username: member.user.username,
            tagNumber: member.user.discriminator,
            picture: member.displayAvatarURL(),
            mention: `<@${member.id}>`,
            joinedAt: moment(member.user.createdAt).locale(guildConf.bot.locale).fromNow()
        }
    }

    if (settings?.isMessageText) {
        settings.messageText &&
        channel?.send(replaceValuesInString(settings.messageText, vars));
    } else {
        (settings?.messageEmbed && settings.messageEmbed.description) &&
            channel?.send({
                content: vars.member.mention,
                embeds: [createEmbedMessage(settings.messageEmbed, vars)]
            });
    }
}

export default welcomeNewGuildMember;