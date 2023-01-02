import mongoose from "mongoose";

export interface IWelcomeMemberModuleSettings {
    isMessageText: boolean,
    channelId?: string;
    messageText?: string;
    messageEmbed?: {
        description: string;
        title?: string;
        author?: {
            name?: string;
            picture?: string;
        };
        fields?: { name: string; value: string, inline?: boolean }[];
        footer?: string;
        thumbnail?: string;
    }
}

export const WelcomeMemberModule: mongoose.SchemaDefinition<IWelcomeMemberModuleSettings> = {
    isMessageText: {
        type: Boolean,
        required: true,
        default: true
    },
    channelId: {
        type: String,
        match: /^\d+$/g,
        max: 50
    },
    messageText: {
        type: String,
        maxLength: 500
    },
    messageEmbed: {
        title: {
            type: String,
            maxLength: 100,
        },
        description: {
            type: String,
            maxLength: 500
        },
        author: {
            name: {
                type: String,
                maxLength: 50
            },
            picture: {
                type: String,
                maxLength: 50
            }
        },
        fields: [{
            _id: false,
            name: {
                type: String,
                maxLength: 100
            },
            value: {
                type: String,
                maxLength: 250
            },
            inline: Boolean,
        }],
        footer: {
            type: String,
            maxLength: 100
        },
        thumbnail: {
            type: String,
            maxLength: 50
        }
    }
}

const WelcomeMemberModuleSettingsSchema = new mongoose.Schema<IWelcomeMemberModuleSettings>(WelcomeMemberModule);

export default mongoose.model<IWelcomeMemberModuleSettings>('WelcomeMemberModuleSettings', WelcomeMemberModuleSettingsSchema);