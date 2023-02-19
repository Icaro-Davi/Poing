import addMuteRole from "./addMuteRole.func";
import argument from "./command.args";
import listMutedMembers from "./listMutedMembers.func";
import { MuteGuildMember } from "./muteGuildMember.func";

import type { Moment } from "moment";
import type { GuildMember, Message, Role } from "discord.js";
import type { ExecuteSlashCommand } from "../../index.types";

const execSlashCommand: ExecuteSlashCommand = async function (interaction, options) {
    const subCommand = interaction.options.getSubcommand();
    const arg = {
        ADD_ROLE: argument.ADD_ROLE(options),
        LIST: argument.LIST(options),
        MEMBER: argument.MEMBER(options),
        REASON: argument.REASON(options),
        TARGET_MEMBER: argument.TARGET_MEMBER(options),
        TARGET_ROLE: argument.TARGET_ROLE(options),
        TIME: argument.TIME(options),
    }
    if (subCommand === argument.MEMBER.name) {
        const muteMember = interaction.options.getMember(arg.TARGET_MEMBER.name, arg.TARGET_MEMBER.required) as GuildMember;
        const reason = interaction.options.getString(arg.REASON.name) as string;
        const muteTime = interaction.options.getString(arg.TIME.name);

        let _muteTime: Moment | undefined;
        try {
            if (muteTime) {
                if (muteTime.match(/^[\d]+(?:D|M|H)$/gi))
                    _muteTime = arg.TIME.filter
                        ? (await arg.TIME.filter({} as Message, ['', interaction.options.getString(arg.TIME.name)!], options.locale, { [arg.MEMBER.name]: muteMember }))?.data
                        : undefined;
                else return { content: options.locale.command.mute.interaction.invalidTime, ephemeral: true }
            }
        } catch (error: any) {
            await interaction.reply({ content: error.message, ephemeral: true });
            return;
        }

        return await MuteGuildMember({
            options, reason,
            muteTime: _muteTime,
            interaction: interaction,
            mutedMember: muteMember,
        });

    }
    if (subCommand === arg.ADD_ROLE.name) {
        const muteRole = interaction.options.getRole(arg.TARGET_ROLE.name, arg.TARGET_ROLE.required) as Role;
        return { content: await addMuteRole({ guild: interaction.guild!, role: muteRole, locale: options.locale }), ephemeral: true };
    }
    if (subCommand === arg.LIST.name) {
        return { content: await listMutedMembers({ guild: interaction.guild!, options }), type: 'embed', ephemeral: true };
    }
}

export default execSlashCommand;