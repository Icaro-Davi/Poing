type FormComponent = {
    label: string;
    placeholder: string;
}

type Field = {
    name: string;
    value: string;
}

export type BaseEmbedCommand = {
    description: string;
    component: {
        embedMessageForm: {
            messageBodyTitleModal: string;
            title: FormComponent;
            description: FormComponent;
            thumbnail: FormComponent;
            footer: FormComponent;
        };
        embedMessageFormField: {
            addNewFieldTitleModal: string;
            title: FormComponent;
            description: FormComponent;
            inline: Omit<FormComponent, 'placeholder'>;
        };
        haveInvalidFlags: {
            title: string;
        };
        incompleteFieldFlags: {
            title: string;
            description: string; // {flag_field_title} {flag_field_value}
        };
        invalidThumbnailUrl: {
            title: string;
            description: string; // {flag_thumbnail}
        }
    };
    createEmbedMessageExplanation: {
        title: string;
        description: string; // {minutes}
        fields: {
            bodyBtn: Field;
            addItemBtn: Field;
            deleteItemBtn: Field;
            submitEmbedMessageBtn: Field;
            cancelEmbedMessageBtn: Field;
        }
    };
    interaction: {
        embedMessageCanceledByInactivity: string;
        embedMessageCreated: string;
        embedMessageCreationCanceled: string;
    };
    usage: {
        flag: {
            description: string;
        }
    }
}