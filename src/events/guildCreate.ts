
import { Guild, MessageEmbed, TextChannel } from "discord.js";
import { GuildApplication } from "../application";
import { DiscordBot } from "../config";
import { getAvailableLocales, getInitialLocaleVars, LocaleLabel, replaceVarsInString } from "../locale";

export const welcomeGuild = async (guild: Guild) => {
    const channel = guild.channels.cache.find(channel => channel.isText()) as TextChannel;
    const localeLang = (getAvailableLocales().some(locale => guild.preferredLocale === locale) ? guild.preferredLocale : 'en-US') as LocaleLabel;
    await GuildApplication.create(guild.id, localeLang);
    const defaultLocaleVars = await getInitialLocaleVars({ locale: localeLang });
    await channel.send({
        embeds: [new MessageEmbed({
            color: DiscordBot.Bot.defaultBotHexColor,
            description: replaceVarsInString(defaultLocaleVars.locale?.interaction.welcomeGuild!, { bot: defaultLocaleVars.bot })
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