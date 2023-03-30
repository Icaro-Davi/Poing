import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection, EmbedBuilder, GuildMember, UserSelectMenuBuilder } from "discord.js";
import { Locale } from "../../../locale";
import { replaceValuesInString } from "../../../utils/replaceValues";
import { UserInputInteractionData as KickMassUserInputInteraction } from "./MassKickCollector.func";

export const createKickMassInteractionComponent = function (params: {
    locale: Locale;
    uniqueId: string;
    embedColor: number;
    userInputInteractionData: KickMassUserInputInteraction;
    collectorTime: number;
    componentRef: {
        cancelId: string;
        voteModeOnId: string;
        voteModeOffId: string;
        selectMembersId: string;
        submitId: string;
    }
}) {
    const message = {
        embeds: [
            new EmbedBuilder({
                title: params.locale.command.kick.embeds.kickMassInteraction.confirmation.title,
                color: params.embedColor,
                ...params.userInputInteractionData.kickedMembers.size > 0
                    ? { description: `${params.locale.command.kick.embeds.kickMassInteraction.confirmation.description}:\n${params.userInputInteractionData.kickedMembers.filter(guildMember => guildMember.kickable).map(guildMember => `[<@${guildMember.id}>]`).join(' ')}` }
                    : {},
                fields: [
                    { name: params.locale.command.kick.embeds.kickMassInteraction.confirmation.field.voteState.title, value: params.userInputInteractionData.isVoteActive ? params.locale.labels.active : params.locale.labels.disabled }
                ]
            }),
            new EmbedBuilder({
                color: params.embedColor,
                title: params.locale.command.kick.embeds.kickMassInteraction.createKickMass.title,
                description: params.locale.command.kick.embeds.kickMassInteraction.createKickMass.description,
                fields: [
                    {
                        name: `☠ ${params.locale.command.kick.components.selectMembers}`,
                        value: params.locale.command.kick.embeds.kickMassInteraction.createKickMass.field.selectMember.description, inline: true
                    },
                    {
                        name: (!params.userInputInteractionData.isVoteActive)
                            ? `❗ ${params.locale.command.kick.components.activeVote}`
                            : `❕ ${params.locale.command.kick.components.disableVote}`,
                        value: replaceValuesInString(params.locale.command.kick.embeds.kickMassInteraction.createKickMass.field.vote.description, {
                            emoji: (!params.userInputInteractionData.isVoteActive) ? '😈' : '👿'
                        }), inline: true
                    },
                    {
                        name: `❌ ${params.locale.labels.cancel}`,
                        value: params.locale.command.kick.embeds.kickMassInteraction.createKickMass.field.cancel.description, inline: true
                    }
                ],
                footer: {
                    text: replaceValuesInString(params.locale.command.kick.embeds.kickMassInteraction.createKickMass.footer, {
                        time: params.collectorTime / (60 * 1000)
                    })
                }
            })
        ],
        components: [
            new ActionRowBuilder<UserSelectMenuBuilder>({
                components: [new UserSelectMenuBuilder({ placeholder: `☠ ${params.locale.command.kick.components.selectMembers}`, customId: params.componentRef.selectMembersId, maxValues: 10 })]
            }),
            new ActionRowBuilder<ButtonBuilder>({
                components: [
                    ...(!params.userInputInteractionData.isVoteActive)
                        ? [new ButtonBuilder({ label: params.locale.command.kick.components.activeVote, emoji: '❗', style: ButtonStyle.Primary, customId: params.componentRef.voteModeOnId })]
                        : [new ButtonBuilder({ label: params.locale.command.kick.components.disableVote, emoji: '❕', style: ButtonStyle.Secondary, customId: params.componentRef.voteModeOffId })],
                    new ButtonBuilder({ label: params.locale.labels.finish, emoji: '✅', style: ButtonStyle.Success, customId: params.componentRef.submitId, disabled: params.userInputInteractionData.kickedMembers.size < 1 }),
                    new ButtonBuilder({ label: `❌ ${params.locale.labels.cancel}`, style: ButtonStyle.Danger, customId: params.componentRef.cancelId })
                ]
            }),
        ]
    }
    return message;
}

export const KickMassVote = {
    voteInteraction: function (params: {
        locale: Locale;
        embedColor: number;
        voteCount: { yes: number; no: number };
        componentRef: { yesId: string; noId: string };
        userInput: { kickedMembers: Collection<string, GuildMember> },
        collectorTime: number;
    }) {
        return {
            ephemeral: false,
            content: '',
            embeds: [new EmbedBuilder({
                color: params.embedColor,
                title: params.locale.command.kick.embeds.voteKickMassInteraction.title,
                description: `\n${params.userInput.kickedMembers.map(member => `[<@${member.id}>]`).join(' ')}`,
                fields: [
                    { name: params.locale.labels.yes, value: `${params.voteCount.yes}`, inline: true },
                    { name: params.locale.labels.no, value: `${params.voteCount.no}`, inline: true },
                ],
                footer: { text: replaceValuesInString(params.locale.command.kick.embeds.voteKickMassInteraction.footer, { time: params.collectorTime / (60 * 1000) }) }
            })],
            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents([
                    new ButtonBuilder({ label: params.locale.labels.yes, custom_id: params.componentRef.yesId, style: ButtonStyle.Primary }),
                    new ButtonBuilder({ label: params.locale.labels.no, custom_id: params.componentRef.noId, style: ButtonStyle.Secondary }),
                ])
            ]
        }
    },
    result: function (params: {
        locale: Locale;
        embedColor: number;
        userInput: { kickedMembers: Collection<string, GuildMember> };
        voteCount: { yes: number; no: number };
    }) {
        const defaultOptions = { ephemeral: false, components: [] };
        if (params.voteCount.yes > params.voteCount.no) {
            return {
                ...defaultOptions,
                embeds: [
                    new EmbedBuilder({
                        color: params.embedColor,
                        title: params.locale.command.kick.embeds.resultVoteYes.title,
                        description: `${params.locale.command.kick.embeds.resultVoteYes.description}:\n${params.userInput.kickedMembers.map(member => `[<@${member.id}>]`).join(' ')}`,
                        fields: [
                            { name: params.locale.labels.yes, value: `${params.voteCount.yes}`, inline: true },
                            { name: params.locale.labels.no, value: `${params.voteCount.no}`, inline: true },
                        ]

                    })
                ],
            }
        } else {
            return {
                ...defaultOptions,
                embeds: [
                    new EmbedBuilder({
                        color: params.embedColor,
                        title: params.locale.command.kick.embeds.resultVoteNo.title,
                        description: `${params.locale.command.kick.embeds.resultVoteNo.description}:\n${params.userInput.kickedMembers.map(member => `[<@${member.id}>]`).join(' ')}`,
                        fields: [
                            { name: params.locale.labels.yes, value: `${params.voteCount.yes}`, inline: true },
                            { name: params.locale.labels.no , value: `${params.voteCount.no}`, inline: true },
                        ]
                    })
                ],
            }
        }
    }
}