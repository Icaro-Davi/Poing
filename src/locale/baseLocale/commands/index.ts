import type { BaseAnonymousDirectMessage } from "./admin/anonymousDirectMessage.type"
import type { BaseBanCommand } from "./moderation/ban.type";
import type { BaseKickCommand } from "./moderation/kick.type";
import type { BaseMuteCommand } from "./moderation/mute.type";
import type { BaseRemoveMessagesCommand } from "./moderation/removeMessages.type";
import type { BaseUnbanCommand } from "./moderation/unban.type";
import type { BaseGetMembersStatusCommand } from "./utility/getMembersStatus.type";
import type { BaseHelpCommand } from "./utility/help.type";
import type { BaseInfoCommand } from "./utility/info.type";
import type { BasePingCommand } from "./utility/ping.type";

export type BaseCommands = {
    anonymousDirectMessage: BaseAnonymousDirectMessage;
    ban: BaseBanCommand;
    kick: BaseKickCommand;
    mute: BaseMuteCommand;
    removeMessages: BaseRemoveMessagesCommand;
    unban: BaseUnbanCommand;
    getMembersStatus: BaseGetMembersStatusCommand;
    help: BaseHelpCommand;
    info: BaseInfoCommand;
    ping: BasePingCommand;
}