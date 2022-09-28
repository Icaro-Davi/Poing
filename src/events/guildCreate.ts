
import { MessageEmbed } from "discord.js";
import { GuildApplication } from "../application";
import { DiscordBot } from "../config";
import { getAvailableLocales } from "../locale";
import { replaceValuesInString  } from "../utils/replaceValues";

import type { LocaleLabel } from "../locale";
import type { Guild, TextChannel } from 'discord.js';

export const welcomeGuild = async (guild: Guild) => {
    const channel = guild.channels.cache.find(channel => channel.isText()) as TextChannel;
    const localeLang = (getAvailableLocales().some(locale => guild.preferredLocale === locale) ? guild.preferredLocale : 'en-US') as LocaleLabel;
    await GuildApplication.create(guild.id, localeLang);
    const locale = await DiscordBot.LocaleMemory.get(localeLang);
    await channel.send({
        embeds: [new MessageEmbed({
            color: DiscordBot.Bot.defaultBotHexColor,
            description: replaceValuesInString(locale?.interaction.welcomeGuild!, { bot: DiscordBot.Bot.getDefaultVars() })
        })]
    });
}

const onBotJoinGuild = async (guild: Guild) => {
    try {
        await welcomeGuild(guild);
    } catch (error) {
        console.error(error);
    }
}

export default () => DiscordBot.Client.get().on('guildCreate', onBotJoinGuild);