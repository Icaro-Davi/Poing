import { MessageEmbed } from "discord.js";
import { GuildApplication } from "../application";
import { DiscordBot } from "../config";
import { getAvailableLocales } from "../locale";
import { replaceValuesInString } from "../utils/replaceValues";

import type { LocaleLabel } from "../locale";
import type { Guild, TextChannel } from 'discord.js';
import { createNewModule } from ".";

export const botIntroductionToGuild = async (guild: Guild) => {
    try {
        const _guild = await GuildApplication.findById(guild.id);
        if (!_guild) {
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
    } catch (error) {
        setTimeout(() => { botIntroductionToGuild(guild) }, 5000);
        throw error;
    }
}

export default createNewModule('guildCreate', botIntroductionToGuild);