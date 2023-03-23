import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Locale } from "../../locale";

type confirmButtonOptions = {
    locale: Locale;
    success?: { label: string, customId?: string };
    danger?: { label: string, customId?: string };
}

const confirmButtons = (options: confirmButtonOptions) => {
    const yesId = options.success?.customId || `ban-id-${Math.random().toString(32).slice(2)}`;
    const noId = options.danger?.customId || `ban-id-${Math.random().toString(32).slice(2)}`;
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setLabel(options.locale.messageActionRow.confirmButtons.successLabel || 'YES')
            .setStyle(ButtonStyle.Success)
            .setCustomId(options.success?.customId || yesId),
        new ButtonBuilder()
            .setLabel(options.locale.messageActionRow.confirmButtons.dangerLabel || 'NO')
            .setStyle(ButtonStyle.Danger)
            .setCustomId(options.danger?.customId || noId)
    );
    return { row, button: { yesId, noId } };
}

export default confirmButtons;