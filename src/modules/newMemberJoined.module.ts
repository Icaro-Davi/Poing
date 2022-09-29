import { MessageEmbed } from "discord.js";
import moment from "moment";
import { ChannelApplication, ModulesApplication } from "../application";
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

    const settings = await ModulesApplication.getWelcomeConfig(guild.id);

    const channel = (settings?.channelId
        ? guild.channels.cache.get(settings.channelId)
        : await ChannelApplication.getMainTextChannel(guild)) as TextChannel;

    const vars = {
        bot: {
            ...DiscordBot.Bot.getDefaultVars(),
            hexColor: guildConf.messageEmbedHexColor || DiscordBot.Bot.defaultBotHexColor
        },
        guild: {
            name: guild.name,
            picture: guild.iconURL({ dynamic: true })
        },
        member: {
            username: member.user.username,
            tagNumber: member.user.discriminator,
            picture: member.displayAvatarURL(),
            mention: `<@${member.id}>`,
            joinedAt: moment(member.user.createdAt).locale(guildConf.locale).fromNow()
        }
    }

    if (settings.isMessageText) {
        channel?.send(replaceValuesInString(settings?.messageText || 'Welcome Message Text', vars));
    } else {
        channel?.send({
            content: vars.member.mention,
            embeds: [createEmbedMessage(settings?.messageEmbed || { description: 'Welcome Message Embed' }, vars)]
        });
    }
}

export default welcomeNewGuildMember;