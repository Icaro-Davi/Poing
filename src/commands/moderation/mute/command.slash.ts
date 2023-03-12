import type { Message } from "discord.js";
import type { Moment } from "moment";
import AnswerMember from "../../../utils/AnswerMember";
import { middleware } from "../../command.middleware";
import addMuteRole from "./addMuteRole.func";
import argument from "./command.args";
import listMutedMembers from "./listMutedMembers.func";
import { MuteGuildMember } from "./muteGuildMember.func";

const execSlashCommand = middleware.create('COMMAND_INTERACTION', async function (interaction, options, next) {
    if (options.context.argument.isMuteMember) {
        const arg = {
            TIME: argument.TIME(options),
            MEMBER: argument.MEMBER(options)
        };
        const mutedMember = options.context.data.target;
        const reason = options.context.data.reason;
        const muteTime = options.context.data.time;

        let _muteTime: Moment | undefined;
        try {
            if (muteTime) {
                if (muteTime.match(/^[\d]+(?:D|M|H)$/gi)) {
                    _muteTime = arg.TIME.filter
                        ? (await arg.TIME.filter({} as Message, ['', muteTime], options.locale, { [arg.MEMBER.name]: mutedMember }))?.data
                        : undefined;
                } else {
                    next({ type: 'COMMAND_USER', message: { content: options.locale.command.mute.interaction.invalidTime, ephemeral: true } }); return;
                }
            }
        } catch (error: any) {
            next({ type: 'UNKNOWN' }); return;
        }

        await MuteGuildMember({
            interaction,
            options, reason, mutedMember,
            muteTime: _muteTime,
            onError() {
                next({ type: 'UNKNOWN' });
            },
        });
        next();
    } else if (options.context.argument.isAddRole) {
        const muteRole = options.context.data.target;
        await addMuteRole({
            guild: interaction.guild!, role: muteRole, locale: options.locale,
            async onError(message) {
                next({ type: 'COMMAND_USER', message: { ephemeral: true, content: message } });
            },
            async onFinish(message) {
                await AnswerMember({
                    interaction, content: { content: message }
                });
                next();
            },
        });
    } else if (options.context.argument.isList) {
        const embed = await listMutedMembers({ guild: interaction.guild!, options });
        await AnswerMember({ content: { embeds: [embed] } });
        next();
    }
});

export default execSlashCommand;