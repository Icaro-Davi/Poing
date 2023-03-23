import { Guild, GuildMember, PartialGuildMember } from "discord.js";
import moment from "moment";
import { DiscordBot } from "../config"
import { IGuildSchema } from "../domain/guild/Guild.schema"

export const getBotVars = ({ guildConf, discordGuild, guildMember }: { guildConf: IGuildSchema; discordGuild: Guild; guildMember: GuildMember | PartialGuildMember }) => {
    return {
        bot: {
            ...DiscordBot.Bot.getDefaultVars(),
            hexColor: guildConf.bot.messageEmbedHexColor || DiscordBot.Bot.defaultBotHexColor
        },
        guild: {
            name: discordGuild.name,
            picture: discordGuild.iconURL(),
            memberCount: discordGuild.memberCount,
        },
        member: {
            username: guildMember.user.username,
            tagNumber: guildMember.user.discriminator,
            picture: guildMember.displayAvatarURL(),
            mention: `<@${guildMember.id}>`,
            joinedAt: moment(guildMember.user.createdAt).locale(guildConf.bot.locale).fromNow()
        }
    }
}