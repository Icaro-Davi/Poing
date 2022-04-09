import { GuildBan, Message } from "discord.js";
import { BotCommand, ExecuteCommandOptions } from "..";
import { createPaginationButtons } from "../../components/messageActionRow";
import { paginationOfBannedMembers } from "../../components/messageEmbed";
import { replaceVarsInString } from "../../locale";
import { onlyWithPermission } from "../../utils/collectorFilters";
import handleError from "../../utils/handleError";

const getPaginationOfBannedMembers = (bannedMembers: GuildBan[]) => {
    return bannedMembers.reduce<{ tag: string; id: string }[][]>((prev, current, i) => {
        let currentPaginationIndex = Number(Number(i / 20).toFixed(0));
        let userReference = { id: current.user.id, tag: current.user.tag };
        if (prev[currentPaginationIndex])
            prev[currentPaginationIndex].push(userReference);
        else
            prev[currentPaginationIndex] = [userReference];
        return prev;
    }, []).reverse();
}

const argumentList = async (message: Message, bannedMembers: { tag: string, id: string }[][], total: number, options: ExecuteCommandOptions) => {
    const pagination = {
        bannedMembers: bannedMembers,
        currentPage: 0,
        maxIndex: bannedMembers.length,
        total: total || 0,
    }

    const paginationComponent = createPaginationButtons();

    const paginationMessage = await message.channel.send({
        embeds: [paginationOfBannedMembers(pagination, options)],
        components: pagination.total > 20 ? [paginationComponent.row] : [],
    });

    if (pagination.total < 20) return;

    const collector = onlyWithPermission(message, options.locale, 'BAN_MEMBERS');
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
                    pagination.currentPage = pagination.total
                    break;
            }
            if (currentPage !== pagination.currentPage && Object.keys(paginationComponent.references).some((key) => paginationComponent.references[key as keyof typeof paginationComponent.references] === interactionButton.customId)) {
                paginationMessage.edit({
                    embeds: [paginationOfBannedMembers(pagination, options)],
                    components: [paginationComponent.row]
                });
                await interactionButton.deferUpdate();
            }
        } catch (error) {
            handleError(error, {
                message,
                locale: options.locale,
                errorLocale: '/commands/moderation/unban',
            });
        }
    });
}

const command: BotCommand = {
    name: 'unban',
    category: '{category.moderation}',
    description: '{command.unban.description}',
    allowedPermissions: ['BAN_MEMBERS'],
    usage: [
        [{
            required: true, arg: '{command.unban.usage.member.arg}',
            description: `{command.unban.usage.member.description}.`,
            example: `{command.unban.usage.member.example}`
        }, {
            required: false, arg: '{command.unban.usage.list.arg}',
            description: '{command.unban.usage.list.description}', example: '{command.unban.usage.list.example}'
        }],
        [{
            required: false, arg: '{usage.reason.arg}',
            description: '{usage.reason.description}',
            example: '{command.unban.usage.reasonExample}'
        }]
    ],
    exec: async (message, args, options) => {
        if (args[0].toLocaleLowerCase() === 'list') {
            const bannedMembers = await message.guild?.bans.fetch();
            const bannedMemberByPages = bannedMembers && getPaginationOfBannedMembers(bannedMembers.toJSON());
            if (!bannedMemberByPages) return await message.channel.send(options.locale.interaction.iDidntFoundAnything);
            return argumentList(message, bannedMemberByPages, bannedMembers.size, options);
        }

        if (Number.isNaN(Number(args[0]))) return message.channel.send(options.locale.interaction.mustBeNumber);
        const memberBanned = await message.guild?.bans.fetch(args[0]);
        if (!memberBanned) return message.channel.send(options.locale.interaction.member.notFound);
        const user = await message.guild?.bans.remove(memberBanned.user, args.slice(1).join(' ') || '');
        if (!user) return await message.reply(options.locale.command.unban.interaction.cantUnban);
        await message.reply(replaceVarsInString(options.locale.command.unban.interaction.memberUnbaned, { unbanedMember: user, authorMention: `<@${message.author.id}>` }));
    }
}

export default command;