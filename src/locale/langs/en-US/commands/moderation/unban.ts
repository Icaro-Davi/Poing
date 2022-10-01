import { BaseUnbanCommand } from "../../../../baseLocale/commands/moderation/unban.type";

const unban: BaseUnbanCommand = {
    "description": "Unban a guild member.",
    "interaction": {
        "totalOfPages": "Total of pages: ",
        "memberUnbaned": "{authorMention} unbanned the member {unbanedMember}",
        "cantUnban": "I couldn't unban the member, sorry TwT"
    },
    "usage": {
        "member": {
            "description": "Member ID to be unbaned.",
        }
    }
}

export default unban;