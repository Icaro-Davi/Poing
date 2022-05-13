import { Guild, Role } from "discord.js";
import { MuteApplication } from "../../../application";
import { Locale } from "../../../locale";

const addMuteRole = async (options: { guild: Guild, role: Role, locale: Locale }) => {
    if (await MuteApplication.addRole(options.guild.id, options.role.id)) return options.locale.command.mute.interaction.muteRoleAdded;
    else return options.locale.command.mute.interaction.cannotRegisterRole;
}

export default addMuteRole;