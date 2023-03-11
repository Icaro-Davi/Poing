import { middleware } from "../../command.middleware";
import guildBanMember from './banMember.func';
import listBannedMembers from "./listBannedMembers.func";
import softBanMember from "./softBan.func";

const defaultCommand = middleware.create('COMMAND', async function (message, args, options, next) {
    if (options.context.data.banMember) {
        if (options.context.argument.isSoftBan) {
            await softBanMember(options.context.data.banMember, message.author, {
                message,
                bot: options.bot,
                locale: options.locale,
                onFinish(params) {
                    options.context.argument.banned = params.banned;
                    next();
                },
                onError(message) {
                    next({ type: 'COMMAND_USER', message: { content: message } });
                },
            }); return;
        }
        if (options.context.argument.isBan) {
            const banMember = options.context.data.banMember;
            const days = options.context.data.days;
            const reason = options.context.data.reason;
            await guildBanMember({
                message, options: {
                    ...options, days, reason, banMember,
                    onError(error) {
                        next({ type: 'COMMAND_USER', message: { content: error } });
                    },
                    onFinish(params) {
                        options.context.argument.banned = params.banned;
                        next();
                    },
                }
            });
            return;
        }
    }
    if (options.context.argument.isList) {
        await listBannedMembers({ options, message });
        next(); return;
    }
});

export default defaultCommand;