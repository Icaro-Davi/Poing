import mongoose from "mongoose";

export type CommandSchemaType = {
    name: string;
    active: boolean;
    premiumTrier: number;
}

const CommandSchema = new mongoose.Schema<CommandSchemaType>({
    name: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    premiumTrier: {
        type: Number,
        required: true,
        default: 1
    }
});

// export default mongoose.model<CommandSchemaType>('Command', CommandSchema);