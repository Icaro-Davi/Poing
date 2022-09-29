import mongoose from 'mongoose';
import BotSchema from '../bot/Bot.schema';

import type { IBotSchema } from '../bot/Bot.schema';
import type { IWelcomeMemberModuleSettings } from '../modules/welcomeModule/WelcomeModule.schema';

export interface IGuildSchema {
    _id: string;
    bot: IBotSchema;
    modules?: {
        welcomeMember?: {
            isActive?: boolean;
            settings?: IWelcomeMemberModuleSettings;
        }
    }
}

const GuildSchema = new mongoose.Schema<IGuildSchema>({
    _id: {
        type: String,
        required: true,
    },
    bot: BotSchema,
    modules: {
        welcomeMember: {
            isActive: {
                type: Boolean,
                default: false,
                required: true
            },
            settings: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'WelcomeMemberModuleSettings'
            }
        }
    }
}, { timestamps: true });

export default mongoose.model<IGuildSchema>('Guild', GuildSchema);