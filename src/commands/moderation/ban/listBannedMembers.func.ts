import { CommandInteraction, Guild, Message } from "discord.js";
import { createPaginationButtons } from "../../../components/messageActionRow";
import { paginationOfBannedMembers } from "../../../components/messageEmbed";
import { onlyWithPermission } from "../../../components/collectorFilters";
import handleError from "../../../utils/handleError";
import { RequireAtLeastOne } from "../../../utils/typescript.funcs";
import { ExecuteCommandOptions } from "../../index.types";

const getPaginationOfBannedMembers = async (guild: Guild) => {
    const bannedMembers = (await guild.bans.fetch()).toJSON();
    const reverseBannedMembers = bannedMembers.reduce<{ tag: string; id: string }[][]>((prev, current, i) => {
        let currentPaginationIndex = Math.floor(Number(i / 20));

        let userReference = { id: current.user.id, tag: current.user.tag };
        if (prev[currentPaginationIndex])
            prev[currentPaginationIndex].push(userReference);
        else
            prev[currentPaginationIndex] = [userReference];
        return prev;
    }, []);
    return {
        bannedMembers: reverseBannedMembers,
        currentPage: 0,
        maxIndex: reverseBannedMembers.length,
        total: bannedMembers.length
    }
}

type ListBannedMembersOptions = RequireAtLeastOne<{
    message: Message;
    interaction: CommandInteraction;
    options: ExecuteCommandOptions;
    ephemeral?: boolean;
}, 'interaction' | 'message'>

const listBannedMembers = async ({ interaction, message, options, ephemeral }: ListBannedMembersOptions) => {
    const guild: Guild = (interaction?.guild ?? message?.guild)!;
    const pagination = await getPaginationOfBannedMembers(guild);

    const paginationComponent = createPaginationButtons();

    const paginationMessage = await (message ?? interaction)?.reply({
        embeds: [paginationOfBannedMembers(pagination, options)],
        components: pagination.total > 20 ? [paginationComponent.row] : [],
        ephemeral
    });

    if (pagination.total < 20) return;

    const collector = onlyWithPermission((message ?? interaction)!, { locale: options.locale, permissions: 'BAN_MEMBERS', ephemeral });
    collector.on('collect', async (interactionButton) => {
        try {
            let currentPage = pagination.currentPage;
            switch (interactionButton.customId) {
                case paginationComponent.references.firstPage:
                    pagination.currentPage = 0;
                    break;
                case paginationComponent.references.previous:
                    (pagination.currentPage - 1 >= 0) && (pagination.currentPage -= 1);
                    break;
                case paginationComponent.references.next:
                    (pagination.currentPage + 1 < pagination.maxIndex) && (pagination.currentPage += 1);
                    break;
                case paginationComponent.references.lastPage:
                    pagination.currentPage = pagination.maxIndex - 1;
                    break;
            }
            if (currentPage !== pagination.currentPage && Object.keys(paginationComponent.references).some((key) => paginationComponent.references[key as keyof typeof paginationComponent.references] === interactionButton.customId)) {
                message ? await paginationMessage!.edit({
                    embeds: [paginationOfBannedMembers(pagination, options)],
                    components: [paginationComponent.row]
                }) : interaction?.editReply({
                    embeds: [paginationOfBannedMembers(pagination, options)],
                    components: [paginationComponent.row],
                });
                await interactionButton.deferUpdate();
            }
        } catch (error) {
            message && handleError(error, {
                message,
                locale: options.locale,
                errorLocale: '/commands/moderation/unban',
            });
        }
    });
}

export default listBannedMembers;