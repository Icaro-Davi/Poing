import { ButtonInteraction, GuildMember, EmbedBuilder, StringSelectMenuInteraction } from "discord.js";
import { DiscordBot } from '../config';
import { createNewModule } from ".";
import MD from "../utils/md";
import Bot from "../config/Bot";
import HexColorToNumber from "../utils/HexColorToNumber";

const RoleInteractionReference = 'role-by-component';

async function RoleByInteraction(interaction: ButtonInteraction | StringSelectMenuInteraction): Promise<boolean> {
    if (interaction.customId.startsWith(RoleInteractionReference)) {
        const guildConfig = await DiscordBot.GuildMemory.get(interaction.guildId ?? '');
        if (!guildConfig.config.modules?.roleByInteraction.isActive) return true;
        const locale = DiscordBot.LocaleMemory.get(guildConfig.config.bot.locale);
        try {
            const member = (interaction.member as GuildMember);
            const roles = await interaction.guild?.roles.fetch();

            const sendReply = async (options: { removedMessage?: string; addedMessage?: string; }) => {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(locale.module.roleByInteraction.embed.title)
                            .setDescription(locale.module.roleByInteraction.embed.description)
                            .setColor(HexColorToNumber(guildConfig.config.bot.messageEmbedHexColor ?? Bot.defaultBotHexColor))
                            .setFields([
                                ...options.addedMessage ? [{ name: `✅ ${locale.labels.added}`, value: options.addedMessage, inline: false }] : [],
                                ...options.removedMessage ? [{ name: `❌ ${locale.labels.removed}`, value: options.removedMessage, inline: false }] : [],
                            ])
                    ],
                    ephemeral: true
                });
            }

            if (interaction.isButton()) {
                const data = JSON.parse(interaction.customId.split(`${RoleInteractionReference}:`)[1]) as { id: string; roleId: string; };
                const role = roles?.find(role => role.id === data.roleId);
                if (role) {
                    const memberAlreadyHaveRole = member.roles.cache.find(_role => role.id === _role.id);
                    if (memberAlreadyHaveRole) {
                        await member.roles.remove(role);
                        await sendReply({ removedMessage: MD.codeBlock.line(role.name) });
                    } else {
                        await member.roles.add(role);
                        await sendReply({ addedMessage: MD.codeBlock.line(role.name) });
                    }
                }
            }

            if (interaction.isAnySelectMenu()) {
                const listRoleId = interaction.values;
                const selectedRoles = roles?.filter(role => listRoleId.some(roleId => roleId === role.id));

                const listToRemoveRoles = member.roles.cache.filter(memberRole => !!selectedRoles?.some(selectedRole => selectedRole.equals(memberRole)));
                const listToAddRoles = selectedRoles?.filter(selectedRole => !listToRemoveRoles.some(removeRole => removeRole.equals(selectedRole)));

                let addMessage = '';
                let removeMessage = '';
                if (listToAddRoles?.size) {
                    await member.roles.add(listToAddRoles);
                    listToAddRoles.forEach(role => { addMessage = `${addMessage} ${MD.codeBlock.line(role.name)}` });
                }
                if (listToRemoveRoles.size) {
                    await member.roles.remove(listToRemoveRoles);
                    listToRemoveRoles.forEach(role => { removeMessage = `${removeMessage} [${MD.codeBlock.line(role.name)}]` });
                }
                (addMessage || removeMessage) && await sendReply({ addedMessage: addMessage, removedMessage: removeMessage });
            }
            return true;
        } catch (error: any) {
            console.error('[MODULE_ROLE_BY_INTERACTION] Error');
            if (error?.code === 50013) {
                const replyMessage = {
                    content: locale.interaction.member.botDoesNotHavePermission,
                    ephemeral: true
                }
                if (!interaction.replied) await interaction.reply(replyMessage);
                else await interaction.editReply(replyMessage);
                return true;
            }
            console.error(error);
            return true;
        }
    }
    return false;
}

export default createNewModule('interactionCreate', RoleByInteraction);
