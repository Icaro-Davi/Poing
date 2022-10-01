import { BaseBanCommand } from "../../../../baseLocale/commands/moderation/ban.type";

const ban: BaseBanCommand = {
    "description": "I will ban a guild member.",
    "error": {
        "50007": "Unable to notify member of your ban.",
        "mustBeNumber": "I only accept numbers.",
        "numberMustBeBetweenTwoValues": "I only accept numbers between 1 and 7 UwU."
    },
    "interaction": {
        "isNotBannable": "This member is sooooo powerful, i can't ban him 😭",
        "banishedCanceled": "Cancelled ❤️",
        "banishedFromServer": "Banned 😈",
        "bannedWithNoReason": "No Reason"
    },
    "usage": {
        "list": {
            "description": "List banned guild members.",
        },
        "days": {
            "description": "Number of days between \"1 and 7\" representing messages to be deleted, default value is 0.",
        },
        "reason": {
            "description": "The reason for the ban.",
        },
    }
}

export default ban;