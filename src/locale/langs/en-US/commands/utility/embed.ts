import { BaseEmbedCommand } from "../../../../baseLocale/commands/utility/embed.type";

const embed: BaseEmbedCommand = {
    description: 'Create an embedded message.',
    createEmbedMessageExplanation: {
        title: 'Create embedded message.',
        description: 'Interact with the buttons to fill in the required information. More details below on how each button works. It will be canceled if there is no interaction within {minutes} minutes.',
        fields: {
            bodyBtn: { name: 'Fill Body', value: 'Opens the main form to fill in the embedded message.' },
            addItemBtn: { name: 'Add Item', value: 'Adds a new field to the embedded message. (Maximum 5 fields)' },
            deleteItemBtn: { name: 'Delete Item', value: 'Deletes last added item.' },
            submitEmbedMessageBtn: { name: 'Finalize', value: 'Finalizes the creation and generates the message.' },
            cancelEmbedMessageBtn: { name: 'Cancel', value: 'Cancel message creation.' }
        }
    },
    component: {
        embedMessageForm: {
            messageBodyTitleModal: 'Message body',
            title: { label: 'Title', placeholder: 'Write something...' },
            description: { label: 'Description', placeholder: 'Write the description...' },
            footer: { label: 'Footer', placeholder: 'Write footer message...' },
            thumbnail: { label: 'Thumbnail', placeholder: 'Paste URL here...' },
        },
        embedMessageFormField: {
            addNewFieldTitleModal: 'Add new field',
            title: { label: 'Field Title', placeholder: 'Write the title...' },
            description: { label: 'Field description', placeholder: 'Write a description...' },
            inline: { label: 'Display field inline' }
        },
        haveInvalidFlags: {
            title: 'You used some invalid flags'
        },
        incompleteFieldFlags: {
            title: 'Some flags may be missing or misspelled',
            description: 'Make sure you passed all flags related to {field_title} or {field_value} correctly.'
        },
        invalidThumbnailUrl: {
            title: 'Bad URL',
            description: 'Use a valid URL or remove the {flag_thumbnail} flag.'
        }
    },
    interaction: {
        embedMessageCanceledByInactivity: 'Canceled due to inactivity.',
        embedMessageCreated: 'Embed message created.',
        embedMessageCreationCanceled: 'Canceled.'
    },
    usage: {
        flag: {
            description: 'Flags to create the embedded message.'
        }
    }
}

export default embed;