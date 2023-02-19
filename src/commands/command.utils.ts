import { CommandInteraction, Message, PermissionResolvable, PermissionString } from "discord.js";
import { Locale } from "../locale";
import AnswerMember from "../utils/AnswerMember";
import { replaceValuesInString } from "../utils/replaceValues";

export const isAllowedToUseThisCommand = async (params: {
    locale: Locale;
    allowedPermissions?: PermissionResolvable[];
    message?: Message;
    interaction?: CommandInteraction;
    isBot?: boolean;
}) => {
    if (!params.allowedPermissions || !params.allowedPermissions.length) return;
    const strategy = params.message ? params.message : params.interaction;
    const userId = params.interaction?.user.id ?? params.message?.author.id ?? '';
    const botId = strategy?.client.user?.id ?? '';

    const member = params.isBot
        ? strategy?.guild?.members.cache.get(botId)
        : strategy?.guild?.members.cache.get(userId);
    if (!member) return true;

    let doesNotHaveThisPermission: PermissionResolvable | undefined;
    const notHavePermission = params.allowedPermissions.some(permission => {
        doesNotHaveThisPermission = permission;
        return !member.permissions.has(permission);
    });

    if (notHavePermission) {
        await AnswerMember({
            message: params.message,
            interaction: params.interaction,
            content: {
                content: params.isBot && params.allowedPermissions.length
                    ? replaceValuesInString(params.locale.interaction.botDontHavePermissions, {
                        role: params.locale.labels.roleName?.[doesNotHaveThisPermission as PermissionString] ?? '{role}'
                    })
                    : params.locale.interaction.member.botDoesNotHavePermission
            }
        });
    }
    return notHavePermission;
}
