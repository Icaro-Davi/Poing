import { CommandInteraction, GuildMember, Message, MessageEmbed } from "discord.js";
import { ExecuteCommandOptions } from "../../index.types";

const submitWarn = async (params: {
    message?: Message;
    interaction?: CommandInteraction;
    options: ExecuteCommandOptions;
    warn: {
        member: GuildMember;
        message?: string;
        embed?: MessageEmbed;
    }
}) => {
    const user = (params.message?.member?.user ?? params.interaction?.user);
    const guild = params.message?.guild ?? params.interaction?.guild;
    if (!user || !guild) return;

    const GuildReferenceMessage = `⚠️ **__${guild.name}__** - __${user.username}#${user.discriminator}__ ⚠️`;
    if (params.warn.message) {
        await params.warn?.member.send(`${GuildReferenceMessage}\n${params.warn.message}`);
    } else if (params.warn.embed) {
        await params.warn.member.send({
            content: GuildReferenceMessage,
            embeds: [params.warn.embed]
        });
    }
}

export default submitWarn;