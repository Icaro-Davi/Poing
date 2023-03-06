import mongoose from "mongoose";

import type { ColorResolvable } from "discord.js";
import type { LocaleLabel } from "../../locale";

export interface IBotRolesSchema {
    muteId: string;
}

const RolesSchema = new mongoose.Schema<IBotRolesSchema>({
    muteId: String,
}, { _id: false });


export interface IChannelSchema {
    logsId: string;
}

const channelSchema = new mongoose.Schema<IChannelSchema>({
    logsId: String,
}, { _id: false });

export interface IBotSchema {
    prefix: string;
    messageEmbedHexColor: ColorResolvable;
    locale: LocaleLabel;
    roles?: IBotRolesSchema;
    channel?: IChannelSchema;
}

const BotSchema = new mongoose.Schema<IBotSchema>({
    prefix: {
        type: String,
        min: 1, max: 5,
        match: new RegExp('^[!@#$%&*\-_=+.:?/]{1,5}', 'g')
    },
    locale: {
        type: String,
        enum: ['pt-BR', 'en-US'],
    },
    messageEmbedHexColor: {
        type: String,
    },
    roles: RolesSchema,
    channel: channelSchema
}, { _id: false });

export default BotSchema;