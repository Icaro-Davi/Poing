import mongoose from "mongoose";
import { CommandSchemaType } from "../command/Command.Schema";

export type CommandSettingSchema = {
    command: CommandSchemaType;
    logActive: boolean;
}

const commandSettingSchema = new mongoose.Schema<CommandSettingSchema>({
    command: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Command'
    },
    logActive: {
        type: Boolean,
        required: true,
        default: true,
    }
});

// export default mongoose.model<CommandSettingSchema>('CommandSetting', commandSettingSchema);