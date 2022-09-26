import mongoose from "mongoose";

import type { LocaleLabel } from "../../locale";
import type { ColorResolvable } from "discord.js";

export interface IBotRolesSchema {
    muteId: string;
}

const RolesSchema = new mongoose.Schema<IBotRolesSchema>({
    muteId: String,
}, { _id: false });

export interface IBotSchema {
    prefix: string;
    messageEmbedHexColor: ColorResolvable;
    locale: LocaleLabel;
    roles?: IBotRolesSchema;
}

const BotSchema = new mongoose.Schema<IBotSchema>({
    prefix: {
        type: String,
        min: 1, max: 5
    },
    locale: {
        type: String,
        enum: ['pt-BR', 'en-US'],
    },
    messageEmbedHexColor: {
        type: String,
    },
    roles: RolesSchema
}, { _id: false });

export default BotSchema;