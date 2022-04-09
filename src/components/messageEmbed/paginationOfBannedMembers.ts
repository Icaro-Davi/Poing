import { MessageEmbed } from "discord.js";
import { ExecuteCommandOptions } from "../../commands";

const paginationOfBannedMembers = (pagination: { bannedMembers: { tag: string, id: string }[][], total: number, maxIndex: number, currentPage: number }, options: ExecuteCommandOptions) => {
    return new MessageEmbed()
        .setColor(options.bot.hexColor)
        .setTitle(`Total de banidos: ${pagination.total}`)
        .setDescription(pagination.bannedMembers[pagination.currentPage]?.reduce(
            (prev, current, i) => `${prev}[${i + 1}] -- [ID]: ${current.id} -- [TAG]: ${current.tag}\n`, '') || options.locale.interaction.iDidntFoundAnything
        )
        .setFooter({ text: pagination.maxIndex ? `${options.locale.command.unban.interaction.totalOfPages}${pagination.currentPage + 1}/${pagination.maxIndex}` : '' })
}

export default paginationOfBannedMembers;