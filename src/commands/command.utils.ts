import { ChatInputCommandInteraction, Message, PermissionResolvable } from "discord.js";
import { Locale } from "../locale";
import AnswerMember from "../utils/AnswerMember";
import DiscordPermission from "../utils/DiscordPermission";
import MD from "../utils/md";
import { replaceValuesInString } from "../utils/replaceValues";

export const isAllowedToUseThisCommand = async (params: {
    locale: Locale;
    allowedPermissions?: PermissionResolvable[];
    message?: Message;
    interaction?: ChatInputCommandInteraction;
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

    const notHavePermission = params.allowedPermissions.find(permission => !member.permissions.has(permission));

    if (notHavePermission) {
        let permissionString = DiscordPermission.stingToBits(notHavePermission);
        console.log(params.isBot, params.allowedPermissions.length);
        await AnswerMember({
            message: params.message,
            interaction: params.interaction,
            content: {
                content: replaceValuesInString(params.isBot ? params.locale.interaction.botDontHavePermissions : params.locale.interaction.youDontHavePermission, {
                    role: permissionString ? params.locale.labels.roleName?.[permissionString] ?? permissionString : '{role}'
                }),
                ephemeral: true
            }
        });
    }
    return notHavePermission;
}

export const extractVarsFromObject = function (obj: { [key: string]: string }) {
    return Object.keys(obj).reduce((prev, current) => {
        if (obj[current])
            return `${prev} ${MD.codeBlock.line(current)} [${obj[current]}]`;
        else return prev;
    }, '');
}