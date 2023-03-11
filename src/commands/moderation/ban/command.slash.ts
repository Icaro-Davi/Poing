import type { User } from "discord.js";
import { middleware } from "../../command.middleware";
import guildBanMember from './banMember.func';
import listBannedMembers from "./listBannedMembers.func";
import softBanMember from "./softBan.func";

const slashCommand = middleware.create('COMMAND_INTERACTION', async function (interaction, options, next) {
    if (options.context.data.banMember) {
        if (options.context.argument.isSoftBan) {
            interaction.member?.user && await softBanMember(options.context.data.banMember, interaction.member.user as User, {
                bot: options.bot, locale: options.locale, interaction,
                onError(message) {
                    next({ type: 'COMMAND_USER', message: { content: message, ephemeral: true } });
                },
                onFinish(params) {
                    options.context.argument.banned = params.banned;
                    next();
                },
            }); return;
        }
        if (options.context.argument.isBan) {
            const days = options.context.data.days;
            const reason = options.context.data.reason;
            await guildBanMember({
                interaction,
                options: {
                    ...options, days, reason, ephemeral: true,
                    banMember: options.context.data.banMember,
                    onError(error) {
                        next({ type: 'COMMAND_USER', message: { content: error, ephemeral: true } });
                    },
                    onFinish(params) {
                        options.context.argument.banned = params.banned;
                        next();
                    },
                }
            }); return;
        }
    }

    if (options.context.argument.isList) {
        await listBannedMembers({ interaction, options, ephemeral: true });
        next(); return;
    }
});

export default slashCommand;