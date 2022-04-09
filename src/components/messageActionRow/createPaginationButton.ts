import { MessageActionRow, MessageButton } from "discord.js";

const createPaginationButtons = () => {
    let firstPage = `pagination-first-page-${Math.random().toString(32).slice(2)}`;
    let previous = `pagination-previous-${Math.random().toString(32).slice(2)}`;
    let next = `pagination-next-${Math.random().toString(32).slice(2)}`;
    let lastPage = `pagination-last-page-${Math.random().toString(32).slice(2)}`;
    const row = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId(firstPage)
            .setStyle('SECONDARY')
            .setLabel('<<'),
        new MessageButton()
            .setCustomId(previous)
            .setStyle('SECONDARY')
            .setLabel('<'),
        new MessageButton()
            .setCustomId(next)
            .setStyle('SECONDARY')
            .setLabel('>'),
        new MessageButton()
            .setCustomId(lastPage)
            .setStyle('SECONDARY')
            .setLabel('>>'),
    );
    return {
        row,
        references: { firstPage, previous, next, lastPage }
    };
}

export default createPaginationButtons;