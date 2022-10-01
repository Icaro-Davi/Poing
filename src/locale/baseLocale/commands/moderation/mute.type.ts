/**
 * check in file to knows where use vars
 */

export type BaseMuteCommand = {
    description: string;
    interaction: {
        invalidTime: string;
        noTimeSilencedMembers: string;
        mutedSuccessful: string; // [memberMutedName, author, duration]
        memberAlreadyMuted: string;
        needMuteRoleId: string;
        muteRoleAdded: string;
        cannotRegisterRole: string;
        roleNotFound: string;
        needRegisterRole: string;
        cannotMuteAdmin: string;
        mustBeNumber: string;
        arg: {
            time: {
                day: string;
                hour: string; // [timeArg]
                minute: string; // [timeArg]
                idk: string; // [timeArg, timeChar]
            }
        }
    }
    usage: {
        reason: {
            description: string;
        }
        addRole: {
            description: string;
        }
        list: {
            description: string;
        }
    }
}
