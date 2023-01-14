import { BaseMessageEmbed } from "../../../baseLocale/components/messageEmbed.type";

const messageEmbed: BaseMessageEmbed = {
    "getHelp": {
        "title": "Command: ",
        "fieldHowToUse": "How to use",
        "fieldAliases": "Aliases",
        "fieldArguments": "Arguments",
        "fieldExamples": "Examples"
    },
    "privateMessage": {
        "title": "The postman {bot.name} has arrived!",
        "description": "**The guild {guild.name} sends you a message.**\n\n__{message}__",
        "footer": "This message was sent by one of the admins."
    },
    "confirmBanishMember": {
        "title": "Please confirm the ban!",
        "fieldNameDays": "Days",
        "fieldDays": "Deleting **{days}** days messages.",
        "fieldReason": "Reason for banishment"
    },
    "confirmSoftBan": {
        "title": "Please confirm soft ban!",
        "description": "By pressing yes the member will be banned and unbanned at the same time and their messages of up to 7 days will be removed."
    },
    "confirmKickMember": {
        "title": "Please confirm the kick!",
        "fieldReason": "Reason for kick"
    },
    "messageToBanishedMember": {
        "title": "You are banned",
        "fieldReason": "Reason for banishment",
        "banWithoutReason": "Without a reason."
    },
    "memberStatus": {
        "title": "List of members by status"
    }
}

export default messageEmbed;