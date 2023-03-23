import { Types } from 'mongoose';
import { Guild, EmbedBuilder, PartialGuildMember } from "discord.js";
import { ChannelApplication, ModulesApplication } from "../application";

import { replaceValuesInObject, replaceValuesInString } from "../utils/replaceValues";
import { getBotVars } from "../utils/bot";
import { createNewModule } from ".";
import type { IGuildSchema } from "../domain/guild/Guild.schema";
import type { IWelcomeMemberModuleSettings } from "../domain/modules/memberWelcomeModule/WelcomeModule.schema";
import type { GuildMember, TextChannel, EmbedData } from "discord.js";

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
    const embedMessage: EmbedData = Object.entries(embedMessageWithVars).reduce((prev, [key, value]: [string, any]) => {
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
    return new EmbedBuilder({
        ...embedMessage,
        color: vars.bot.hexColor,
    });
}

export async function createMessage<S extends IWelcomeMemberModuleSettings>({ discordGuild, guildMember, moduleSettings, guildConf }: { guildMember: GuildMember | PartialGuildMember, discordGuild: Guild, moduleSettings: S, guildConf: IGuildSchema }) {
    const channel = (moduleSettings?.channelId
        ? discordGuild.channels.cache.get(moduleSettings.channelId)
        : await ChannelApplication.getMainTextChannel(discordGuild)) as TextChannel;

    const vars = getBotVars({ discordGuild, guildConf: guildConf as IGuildSchema, guildMember: guildMember });

    if (moduleSettings?.isMessageText) {
        moduleSettings.messageText &&
            channel?.send(replaceValuesInString(moduleSettings.messageText, vars));
    } else {
        (moduleSettings?.messageEmbed && moduleSettings.messageEmbed.description) &&
            channel?.send({
                content: vars.member.mention,
                embeds: [createEmbedMessage(moduleSettings.messageEmbed, vars)]
            });
    }
}

const welcomeNewGuildMember = async (member: GuildMember, guildConf: Omit<IGuildSchema, '_id'>) => {
    try {
        const moduleId: Types.ObjectId = guildConf.modules?.welcomeMember?.settings as unknown as Types.ObjectId;
        if (Types.ObjectId.isValid(moduleId)) {
            const guild = member.guild;
            const settings = await ModulesApplication.getWelcomeSettingsById(moduleId);
            if (settings)
                await createMessage({
                    discordGuild: guild,
                    guildConf: guildConf as IGuildSchema,
                    guildMember: member,
                    moduleSettings: settings
                });
        }
    } catch (error) {
        console.error('[ERROR_MODULE_NEW_MEMBER_JOINED] Error on src.modules.newMemberJoined.module.ts \n', error);
    }
}

export default createNewModule('guildMemberAdd', welcomeNewGuildMember);