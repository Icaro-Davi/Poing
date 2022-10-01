import { BaseMuteCommand } from "../../../../baseLocale/commands/moderation/mute.type";

const mute: BaseMuteCommand = {
    "description": "Mute a member",
    "interaction": {
        "invalidTime": "TIME argument is invalid, try again using e.g. 10M for minutes, 1H for hours, 7D for days.",
        "noTimeSilencedMembers": "🙊 No time-silenced members.",
        "mutedSuccessful": "Member {memberMutedName} was muted for {author} and will end {duration}.",
        "memberAlreadyMuted": "This member is already muted.",
        "needMuteRoleId": "Register a role that i can use to \"mute\" any member, use `!mute --a \"Role name | Role ID | @Role\"` to add a role.",
        "muteRoleAdded": "I will remember this role 🧑‍💻",
        "cannotRegisterRole": "I couldn't register this role.",
        "roleNotFound": "I couldn't find this role in guild.",
        "needRegisterRole": "Need help to add a role? Use `!help mute` 🤓",
        "mustBeNumber": 'Must be a number.',
        "cannotMuteAdmin": "I can't... this member... so strong. 😱",
        "arg": {
            "time": {
                "day": "Cannot be longer than 365 days.",
                "hour": "`{timeArg}` - Cannot be longer than 24 hours.",
                "minute": "{timeArg} - Cannot be longer than 60 minutes.",
                "idk": "I couldn't understand {timeArg}{timeChar}"
            }
        }
    },
    "usage": {
        "reason": {
            "description": "Reason to mute the member.",
        },
        "addRole": {
            "description": "Add a role to use to punish a member.",
        },
        "list": {
            "description": "List the 50 closest members to ending the punishment.",
        }
    }
}

export default mute;