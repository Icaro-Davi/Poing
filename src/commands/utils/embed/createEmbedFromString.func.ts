import { ChatInputCommandInteraction, Message, EmbedBuilder } from "discord.js";
import AnswerMember from "../../../utils/AnswerMember";
import { IteratorFlags } from "../../../utils/regex/getValuesFromStringFlag";
import isURL from "../../../utils/regex/isURL";
import { replaceValuesInString } from "../../../utils/replaceValues";
import { ExecuteCommandOptions } from "../../index.types";

type EmbedField = { name: string; value: string, inline: boolean };

const CreateEmbedFromString = async (params: {
    embedMessageFlags: IteratorFlags;
    options: ExecuteCommandOptions;
    message?: Message
    interaction?: ChatInputCommandInteraction;
    onFinish?: (embed: EmbedBuilder) => Promise<void> | void;
}) => {
    try {
        const user = params.interaction?.user ?? params.message?.member?.user;
        const embedColor = params.options.bot.hexColor;
        const embedLocale = params.options.locale.command.embed;
        if (!user) return;

        if (params.embedMessageFlags.invalidFlags.length) {
            const message: EmbedBuilder = new EmbedBuilder({
                title: embedLocale.component.haveInvalidFlags.title,
                description: params.embedMessageFlags.invalidFlags.join(' '),
                color: embedColor,
            });
            await AnswerMember({ message: params.message, interaction: params.interaction, content: { embeds: [message], ephemeral: true } });
            return;
        }

        let fieldTitle = (params.embedMessageFlags.flag.get('fieldTitle') as string[]) ?? [];
        let fieldValue = (params.embedMessageFlags.flag.get('fieldTitle') as string[]) ?? [];
        if (fieldTitle.length !== fieldValue.length) {
            const embed: EmbedBuilder = new EmbedBuilder({
                title: embedLocale.component.incompleteFieldFlags.title,
                description: replaceValuesInString(embedLocale.component.incompleteFieldFlags.description, {
                    '{flag_field_title}': '**__field_title__**',
                    '{flag_field_value}': '**__field_value__**'
                }),
                color: embedColor,
            });
            await AnswerMember({ message: params.message, interaction: params.interaction, content: { embeds: [embed], ephemeral: true } });
            return;
        }

        let fieldTitleInline = (params.embedMessageFlags.flag.get('fieldTitleInline') as string[]) ?? [];
        let fieldValueInline = (params.embedMessageFlags.flag.get('fieldValueInline') as string[]) ?? [];
        if (fieldTitleInline.length !== fieldValueInline.length) {
            const embed: EmbedBuilder = new EmbedBuilder({
                title: embedLocale.component.incompleteFieldFlags.title,
                description: replaceValuesInString(embedLocale.component.incompleteFieldFlags.description, {
                    '{flag_field_title}': '**__field_title_inline__**',
                    '{flag_field_value}': '**__field_title_inline__**'
                }),
                color: embedColor
            });
            await AnswerMember({ message: params.message, interaction: params.interaction, content: { embeds: [embed], ephemeral: true } });
            return;
        }

        let thumbnail = params.embedMessageFlags.flag.get('thumbnail');
        if (typeof thumbnail === 'string' && !isURL(thumbnail)) {
            const embed: EmbedBuilder = new EmbedBuilder({
                title: embedLocale.component.invalidThumbnailUrl.title,
                description: replaceValuesInString(embedLocale.component.invalidThumbnailUrl.description, {
                    '{flag_thumbnail}': '**__thumb__**'
                }),
                color: embedColor,
                footer: { text: thumbnail }
            });
            await AnswerMember({ message: params.message, interaction: params.interaction, content: { embeds: [embed], ephemeral: true } });
            return;
        }

        const message = { fields: [], color: embedColor, author: { name: user.username, iconURL: user.avatarURL() } } as { [key: string]: any; fields: EmbedField[] };
        const assignMessageFields = (fieldValues: string[], ignoreThisField: (field: EmbedField) => boolean, onFindFillableSlot: (value: string, index: number) => void) => {
            fieldValues.forEach((value, index) => {
                if (!message.fields[index]) message.fields[index] = {} as EmbedField;
                message.fields.some((field, i) => {
                    if (ignoreThisField(field)) return false;
                    else {
                        onFindFillableSlot(value, i);
                        return true;
                    }
                });
            });
        }

        for (const flag of params.embedMessageFlags.flag.entries()) {
            const key = flag[0];
            const value = flag[1];
            switch (key) {
                case 'fieldTitle':
                    if (Array.isArray(value))
                        assignMessageFields(value, (field) => !!field.name, (value, index) => {
                            message.fields[index].name = value;
                            message.fields[index].inline = false;
                        });
                    break;

                case 'fieldValue':
                    if (Array.isArray(value))
                        assignMessageFields(value, field => !!field.value, (value, index) => {
                            message.fields[index].value = value;
                            message.fields[index].inline = false;
                        });
                    break;

                case 'fieldTitleInline':
                    if (Array.isArray(value))
                        assignMessageFields(value, (field) => !!field.name, (value, index) => {
                            message.fields[index].name = value;
                            message.fields[index].inline = true;
                        });
                    break;

                case 'fieldValueInline':
                    if (Array.isArray(value))
                        assignMessageFields(value, (field) => !!field.value, (value, index) => {
                            message.fields[index].value = value;
                            message.fields[index].inline = true;
                        });
                    break;

                case 'thumbnail':
                    message[key] = { url: value };
                    break;

                case 'footer':
                    message[key] = { text: value };
                    break;

                default:
                    message[key] = value;
                    break;
            }
        }

        params.onFinish
            ? await params.onFinish(message as unknown as EmbedBuilder)
            : await AnswerMember({
                message: params.message,
                interaction: params.interaction,
                content: {
                    embeds: [new EmbedBuilder(message)]
                }
            });
    } catch (error) {
        console.log('/src/commands/utils/embed/createEmbedFromString.Func.ts', error);
        throw error;
    }
}

export default CreateEmbedFromString;