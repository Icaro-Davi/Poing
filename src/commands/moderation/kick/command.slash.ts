import kickMember from "./kickMember.func";
import { middleware } from "../../command.middleware";
import CreateMassKickCollector from "./MassKickCollector.func";
import BulkKickMembers from "./BulkKickMember.func";
import VoteCollector from "../../../collectors/Vote/intex";
import AnswerMember from "../../../utils/AnswerMember";
import { ActionRowBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { ButtonBuilder } from "@discordjs/builders";

const execSlashCommand = middleware.create('COMMAND_INTERACTION', async function (interaction, options, next) {
    if (options.context.argument.isKick) {
        const kickedMember = options.context.data.kickedMember;
        const reason = options.context.data.reason;
        await kickMember({
            kickedMember, options, interaction, reason, ephemeral: true,
            onError(message) {
                next({ type: 'COMMAND_USER', message: { content: message, ephemeral: true } })
            },
            onFinish(params) {
                options.context.argument.kicked = params.kicked;
                next();
            },
        });
    } else if (options.context.argument.isMassKick) {
        const author = interaction.user;
        await CreateMassKickCollector({
            options, interaction,
            event: {
                async onFinish(userInput) {
                    if (userInput.isVoteActive) {
                        console.log('Vote and Bulk delete');
                        new VoteCollector({ interaction, vote: { endsInMilliseconds: 1000 * 60 * 1 } })
                            .applyMutableComponent(async function (_userInput, componentRef) {
                                await AnswerMember({
                                    interaction,
                                    options: { editReply: true },
                                    content: {
                                        ephemeral: false,
                                        content: `Contagem:\nsim ${_userInput.vote.yes.size}\nnão ${_userInput.vote.no.size}`,
                                        embeds: [new EmbedBuilder({ description: `Voto para kickar os membros:\n${userInput.kickedMembers.map(member => `[<@${member.id}>]`).join(' ')}` })],
                                        components: [
                                            new ActionRowBuilder<ButtonBuilder>().addComponents([
                                                new ButtonBuilder({ label: 'Sim', custom_id: componentRef.yesId, style: ButtonStyle.Primary }),
                                                new ButtonBuilder({ label: 'Não', custom_id: componentRef.noId, style: ButtonStyle.Secondary }),
                                            ])
                                        ]
                                    }
                                });
                            })
                            .onFinish(result => console.log(result));
                    } else {
                        console.log('Bulk Delete');
                        // await BulkKickMembers([...userInput.kickedMembers.values()], `${author.username}#${author.discriminator} used kick mass command`);
                    }
                    next();
                },
            }
        });
    }
});

export default execSlashCommand;