import { CommandInteraction, Message, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed, Modal, ModalSubmitInteraction, TextInputComponent } from 'discord.js';
import { Locale } from '../../../locale';
import AnswerMember from '../../../utils/AnswerMember';
import CancelablePromise from '../../../utils/CancelablePromise';
import CreateComponentId from '../../../utils/CreateComponentId';
import isURL from '../../../utils/regex/isURL';
import { ExecuteCommandOptions } from '../../index.types';

const createId = (componentId: string, uniqueId: string) => CreateComponentId('utils-embed', `${uniqueId}-${componentId}`);
const collectorTime = 1000 * 60 * 5;

const createEmbedForm = (params: {
    locale: Locale;
    uniqueId: string;
}) => {
    const modalId = createId(`body-modal`, params.uniqueId);
    const form = {
        titleId: createId(`form-title`, params.uniqueId),
        descriptionId: createId(`form-description`, params.uniqueId),
        thumbnailId: createId(`form-thumbnail`, params.uniqueId),
        footerId: createId(`form-footer`, params.uniqueId),
    }
    const titleComponent = new TextInputComponent({
        type: 'TEXT_INPUT',
        label: params.locale.command.embed.component.embedMessageForm.title.label,
        placeholder: params.locale.command.embed.component.embedMessageForm.title.placeholder,
        style: 'SHORT',
        customId: form.titleId,
        maxLength: 256
    });

    const descriptionComponent = new TextInputComponent({
        type: 'TEXT_INPUT',
        label: params.locale.command.embed.component.embedMessageForm.description.label,
        placeholder: params.locale.command.embed.component.embedMessageForm.description.placeholder,
        maxLength: 4000,
        style: 'PARAGRAPH',
        customId: form.descriptionId
    });

    const thumbnailComponent = new TextInputComponent({
        type: 'TEXT_INPUT',
        label: params.locale.command.embed.component.embedMessageForm.thumbnail.label,
        placeholder: params.locale.command.embed.component.embedMessageForm.thumbnail.placeholder,
        style: 'SHORT',
        customId: form.thumbnailId
    });

    const footerComponent = new TextInputComponent({
        type: 'TEXT_INPUT',
        label: params.locale.command.embed.component.embedMessageForm.footer.label,
        placeholder: params.locale.command.embed.component.embedMessageForm.footer.placeholder,
        style: 'SHORT',
        maxLength: 2040,
        customId: form.footerId
    });

    const modal = new Modal({
        title: params.locale.command.embed.component.embedMessageForm.messageBodyTitleModal,
        customId: modalId,
        components: [
            new MessageActionRow({ components: [titleComponent] }),
            new MessageActionRow({ components: [descriptionComponent] }),
            new MessageActionRow({ components: [thumbnailComponent] }),
            new MessageActionRow({ components: [footerComponent] }),
        ]
    });

    return { modal, form, modalId };
}

const createEmbedFormField = (params: {
    locale: Locale;
    uniqueId: string;
}) => {
    const modalId = createId(`fields-modal`, params.uniqueId);
    const form = {
        titleFieldId: createId(`form-title-field`, params.uniqueId),
        descriptionFieldId: createId(`form-description-field`, params.uniqueId),
        inlineFieldId: createId(`form-inline-field`, params.uniqueId),
    }
    const titleField = new TextInputComponent({
        type: 'TEXT_INPUT',
        label: params.locale.command.embed.component.embedMessageFormField.title.label,
        placeholder: params.locale.command.embed.component.embedMessageFormField.title.placeholder,
        style: 'SHORT',
        maxLength: 256,
        customId: form.titleFieldId,
        required: true
    });

    const descriptionField = new TextInputComponent({
        type: 'TEXT_INPUT',
        label: params.locale.command.embed.component.embedMessageFormField.description.label,
        placeholder: params.locale.command.embed.component.embedMessageFormField.description.placeholder,
        style: 'PARAGRAPH',
        maxLength: 1020,
        customId: form.descriptionFieldId,
        required: true
    });

    const inlineField = new TextInputComponent({
        type: 'SELECT_MENU',
        label: params.locale.command.embed.component.embedMessageFormField.inline.label,
        placeholder: '(y)es ~ (n)o',
        style: 'SHORT',
        value: 'yes',
        customId: form.inlineFieldId,
        maxLength: 3,
    });

    const modal = new Modal({
        title: params.locale.command.embed.component.embedMessageFormField.addNewFieldTitleModal,
        customId: modalId,
        components: [
            new MessageActionRow({ components: [titleField] }),
            new MessageActionRow({ components: [descriptionField] }),
            new MessageActionRow({ components: [inlineField] })
        ]
    });

    return { modal, form, modalId };
}

const createHelperEmbedMessage = (params: {
    locale: Locale;
    uniqueId: string;
    color: number;
}) => {
    const openEmbedModalId = createId(`open-modal`, params.uniqueId);
    const appendEmbedFieldId = createId(`append-field`, params.uniqueId);
    const deleteLastField = createId(`delete-field`, params.uniqueId);
    const submitEmbedMessage = createId(`submit-embed`, params.uniqueId);
    const cancelCreateEmbedId = createId(`cancel`, params.uniqueId);
    const messageObject = {
        ephemeral: true,
        embeds: [new MessageEmbed({
            title: params.locale.command.embed.createEmbedMessageExplanation.title,
            description: params.locale.command.embed.createEmbedMessageExplanation.description.replace('{minutes}', `${collectorTime / 1000 / 60}`),
            color: params.color,
            fields: [
                {
                    name: `📜 ${params.locale.command.embed.createEmbedMessageExplanation.fields.bodyBtn.name}`,
                    value: params.locale.command.embed.createEmbedMessageExplanation.fields.bodyBtn.value, inline: true
                },
                {
                    name: `🖇️ ${params.locale.command.embed.createEmbedMessageExplanation.fields.addItemBtn.name}`,
                    value: params.locale.command.embed.createEmbedMessageExplanation.fields.addItemBtn.value, inline: true
                },
                {
                    name: `🚮 ${params.locale.command.embed.createEmbedMessageExplanation.fields.deleteItemBtn.name}`,
                    value: params.locale.command.embed.createEmbedMessageExplanation.fields.deleteItemBtn.value, inline: true
                },
                {
                    name: `✅ ${params.locale.command.embed.createEmbedMessageExplanation.fields.submitEmbedMessageBtn.name}`,
                    value: params.locale.command.embed.createEmbedMessageExplanation.fields.deleteItemBtn.value, inline: true
                },
                {
                    name: `❌ ${params.locale.command.embed.createEmbedMessageExplanation.fields.cancelEmbedMessageBtn.name}`,
                    value: params.locale.command.embed.createEmbedMessageExplanation.fields.cancelEmbedMessageBtn.value, inline: true
                }
            ]
        })],
        components: [
            new MessageActionRow({
                components: [
                    new MessageButton({ type: 'BUTTON', label: `📜 ${params.locale.command.embed.createEmbedMessageExplanation.fields.bodyBtn.name}`, customId: openEmbedModalId, style: 'PRIMARY' }),
                    new MessageButton({ type: 'BUTTON', label: `🖇️ ${params.locale.command.embed.createEmbedMessageExplanation.fields.addItemBtn.name}`, customId: appendEmbedFieldId, style: 'SECONDARY' }),
                    new MessageButton({ type: 'BUTTON', label: `🚮 ${params.locale.command.embed.createEmbedMessageExplanation.fields.deleteItemBtn.name}`, customId: deleteLastField, style: 'DANGER' }),
                    new MessageButton({ type: 'BUTTON', label: `✅ ${params.locale.command.embed.createEmbedMessageExplanation.fields.submitEmbedMessageBtn.name}`, customId: submitEmbedMessage, style: 'SUCCESS' }),
                    new MessageButton({ type: 'BUTTON', label: `❌ ${params.locale.command.embed.createEmbedMessageExplanation.fields.cancelEmbedMessageBtn.name}`, customId: cancelCreateEmbedId, style: 'DANGER' })
                ]
            })
        ]
    };

    return {
        embed: messageObject,
        ref: { openEmbedModalId, appendEmbedFieldId, deleteLastField, submitEmbedMessage, cancelCreateEmbedId }
    }
}

const CreateEmbedCollectorData = async (params: {
    options: ExecuteCommandOptions;
    interaction?: CommandInteraction;
    message?: Message;
    events?: {
        onSubmit?: (embed: MessageEmbed) => Promise<void> | void;
        onCancel?: () => Promise<void> | void;
    }
}) => {
    const user = (params.interaction?.user ?? params.message?.member?.user);
    const embedColor = parseInt(`${params.options.bot.hexColor}`.replace('#', ''), 16);
    if (!user) return;
    const uniqueId = `${Math.random().toString(32).slice(4)}-${user.id}`;

    const collectorParams = {
        filter: (msg: MessageComponentInteraction) => msg.user.id === user.id,
        time: collectorTime
    }

    const messageObject = createHelperEmbedMessage({ locale: params.options.locale, uniqueId, color: embedColor });
    const answerInteraction = await AnswerMember({
        interaction: params.interaction,
        message: params.message,
        content: messageObject.embed
    });

    const collector = (params.message?.channel?.createMessageComponentCollector(collectorParams) ?? params.interaction?.channel?.createMessageComponentCollector(collectorParams))!;

    const replyAnswerMember = {
        interaction: params.interaction,
        message: params.message,
        options: { editReply: true },
    }
    const expirationMessage = (reset?: NodeJS.Timeout) => {
        reset && clearTimeout(reset);
        if (answerInteraction) {
            return setTimeout(async () => {
                try {
                    await AnswerMember({
                        ...replyAnswerMember,
                        content: {
                            ephemeral: true,
                            content: params.options.locale.command.embed.interaction.embedMessageCanceledByInactivity,
                            embeds: [],
                            components: []
                        },
                    });
                    collector.stop();
                } catch (error) {
                    console.error('/commands/utils/embed/createEmbedCollectorData', error);
                }
            }, collectorTime);
        }
    }

    const mainEmbedMessage = createEmbedForm({ locale: params.options.locale, uniqueId });
    const fieldEmbedMessage = createEmbedFormField({ locale: params.options.locale, uniqueId });

    const embed = { author: { name: user.username, iconURL: user.avatarURL() }, color: embedColor } as MessageEmbed;
    embed.fields = [];
    let expirationRef = expirationMessage();
    let embedBodyPromise: CancelablePromise<ModalSubmitInteraction> | undefined;
    let embedFieldPromise: CancelablePromise<ModalSubmitInteraction> | undefined;
    let isDone = false;
    collector.on('collect', async (msg) => {
        try {
            if (!msg.customId.includes(uniqueId)) return;
            switch (msg.customId) {
                case messageObject.ref.openEmbedModalId:
                    await msg.showModal(mainEmbedMessage.modal);
                    if (embedBodyPromise) embedBodyPromise.cancel();
                    embedBodyPromise = new CancelablePromise(() => msg.awaitModalSubmit({ time: collectorTime }));
                    embedBodyPromise.onResolve(async (modalSubmit) => {
                        embed.title = modalSubmit.fields.getTextInputValue(mainEmbedMessage.form.titleId) ?? '';
                        embed.description = modalSubmit.fields.getTextInputValue(mainEmbedMessage.form.descriptionId) ?? '';
                        embed.thumbnail = { url: isURL(modalSubmit.fields.getTextInputValue(mainEmbedMessage.form.thumbnailId)) ?? '' };
                        embed.footer = { text: modalSubmit.fields.getTextInputValue(mainEmbedMessage.form.footerId) ?? '' };
                        await modalSubmit.deferUpdate();
                        await AnswerMember({ ...replyAnswerMember, content: { ...messageObject, embeds: [embed, ...messageObject.embed.embeds] } });
                    });
                    break;

                case messageObject.ref.appendEmbedFieldId:
                    if (embed.fields && embed.fields.length < 5) {
                        await msg.showModal(fieldEmbedMessage.modal);
                        if (embedFieldPromise) embedFieldPromise.cancel();
                        embedFieldPromise = new CancelablePromise(() => msg.awaitModalSubmit({ time: collectorTime }));
                        embedFieldPromise.onResolve(async modalSubmit => {
                            const field = {
                                name: modalSubmit.fields.getTextInputValue(fieldEmbedMessage.form.titleFieldId) ?? '',
                                value: modalSubmit.fields.getTextInputValue(fieldEmbedMessage.form.descriptionFieldId) ?? '',
                                inline: !!modalSubmit.fields.getTextInputValue(fieldEmbedMessage.form.inlineFieldId).match(/^y(?:(?:es)?)$/i)
                                    ? true
                                    : typeof modalSubmit.fields.getTextInputValue(fieldEmbedMessage.form.inlineFieldId).match(/^y(?:(?:es)?)$/i) === null ? true : false
                            }
                            embed.fields = [...embed.fields, field];
                            await modalSubmit.deferUpdate();
                            await AnswerMember({ ...replyAnswerMember, content: { ...messageObject, embeds: [embed, ...messageObject.embed.embeds] } });
                        });
                    } else await msg.deferUpdate();
                    break;

                case messageObject.ref.deleteLastField:
                    embed.fields.pop();
                    await AnswerMember({ ...replyAnswerMember, content: { ...messageObject, embeds: [embed, ...messageObject.embed.embeds] } });
                    await msg.deferUpdate();
                    break;

                case messageObject.ref.submitEmbedMessage:
                    const channel = (params.interaction?.channel ?? params.message?.channel);
                    if (channel) {
                        if (params?.events?.onSubmit) await params.events.onSubmit(embed);
                        else await channel.send({ embeds: [embed] });
                        await AnswerMember({
                            ...replyAnswerMember,
                            content: {
                                ephemeral: true,
                                content: params.options.locale.command.embed.interaction.embedMessageCreated,
                                embeds: [],
                                components: []
                            }
                        });
                        expirationRef && clearTimeout(expirationRef);
                        collector.stop();
                        await msg.deferUpdate();
                        isDone = true;
                    }
                    break;

                case messageObject.ref.cancelCreateEmbedId:
                    if (params?.events?.onCancel) await params.events.onCancel();
                    await AnswerMember({
                        ...replyAnswerMember,
                        content: {
                            ephemeral: true,
                            content: params.options.locale.command.embed.interaction.embedMessageCreationCanceled,
                            embeds: [],
                            components: []
                        }
                    });
                    expirationRef && clearTimeout(expirationRef);
                    collector.stop();
                    await msg.deferUpdate();
                    isDone = true;
                    break;
            }
            if (!isDone) {
                collector.resetTimer({ time: collectorTime });
                expirationRef = expirationMessage(expirationRef);
            }
        } catch (error) {
            console.error('/commands/utils/embed/createEmbedCollectorData', error);
        }
    });
}

export default CreateEmbedCollectorData;