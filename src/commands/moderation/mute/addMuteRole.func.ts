import { CommandInteraction, Guild, Message, Role } from "discord.js";
import { MuteApplication } from "../../../application";
import { Locale } from "../../../locale";

const addMuteRole = async (options: {
    guild: Guild;
    role: Role;
    locale: Locale;
    onError: (message: string) => void;
    onFinish: (message: string) => void;
}) => {
    if (await MuteApplication.addRole(options.guild.id, options.role.id)) {
        await options.onFinish(options.locale.command.mute.interaction.muteRoleAdded);
    } else {
        await options.onError(options.locale.command.mute.interaction.cannotRegisterRole);
    }
}

export default addMuteRole;