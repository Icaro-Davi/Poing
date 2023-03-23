import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

const createPaginationButtons = () => {
    let firstPage = `pagination-first-page-${Math.random().toString(32).slice(2)}`;
    let previous = `pagination-previous-${Math.random().toString(32).slice(2)}`;
    let next = `pagination-next-${Math.random().toString(32).slice(2)}`;
    let lastPage = `pagination-last-page-${Math.random().toString(32).slice(2)}`;
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId(firstPage)
            .setStyle(ButtonStyle.Secondary)
            .setLabel('<<'),
        new ButtonBuilder()
            .setCustomId(previous)
            .setStyle(ButtonStyle.Secondary)
            .setLabel('<'),
        new ButtonBuilder()
            .setCustomId(next)
            .setStyle(ButtonStyle.Secondary)
            .setLabel('>'),
        new ButtonBuilder()
            .setCustomId(lastPage)
            .setStyle(ButtonStyle.Secondary)
            .setLabel('>>'),
    );
    return {
        row,
        references: { firstPage, previous, next, lastPage }
    };
}

export default createPaginationButtons;