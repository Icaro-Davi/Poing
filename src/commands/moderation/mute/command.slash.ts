import { GuildMember, Message, Role } from "discord.js";
import { Moment } from "moment";
import { ExecuteSlashCommand } from "../../index.types";
import addMuteRole from "./addMuteRole.func";
import argument from "./command.args";
import listMutedMembers from "./listMutedMembers.func";
import { MuteGuildMember } from "./muteGuildMember.func";

const execSlashCommand: ExecuteSlashCommand = async (interaction, options) => {
    const subCommand = interaction.options.getSubcommand();
    if (subCommand === argument.MEMBER.name) {
        const muteMember = interaction.options.getMember(argument.TARGET_MEMBER.name, argument.TARGET_MEMBER.required) as GuildMember;
        const reason = interaction.options.getString(argument.REASON.name) as string;
        const muteTime = interaction.options.getString(argument.TIME.name);

        let _muteTime: Moment | undefined;
        try {
            if (muteTime) {
                if (muteTime.match(/^[\d]+(?:D|M|H)$/gi))
                    _muteTime = argument.TIME.filter
                        ? argument.TIME.filter({} as Message, ['', interaction.options.getString(argument.TIME.name)!], options.locale, { [argument.MEMBER.name]: muteMember })
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
            author: interaction.user,
            guild: interaction.guild!,
            mutedMember: muteMember,
            ephemeral: true
        });

    }
    if (subCommand === argument.ADD_ROLE.name) {
        const muteRole = interaction.options.getRole(argument.TARGET_ROLE.name, argument.TARGET_ROLE.required) as Role;
        return { content: await addMuteRole({ guild: interaction.guild!, role: muteRole, locale: options.locale }), ephemeral: true };
    }
    if (subCommand === argument.LIST.name) {
        return { content: await listMutedMembers({ guild: interaction.guild!, options }), type: 'embed', ephemeral: true };
    }
}

export default execSlashCommand;