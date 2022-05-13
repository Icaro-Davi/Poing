import { Locale } from "../src/locale";

const en_US: Locale = {
    "localeLabel": "en-US",
    "category": {
        "label": "Category",
        "administration": "Admin",
        "moderation": "Moderation",
        "utility": "Utility"
    },
    "status": {
        "online": "Online",
        "idle": "Idle",
        "dnd": "Do not Disturb",
        "offline": "Offline",
        "invisible": "Invisible"
    },
    "labels": {
        "nickname": "Nickname",
        "name": "Name",
        "ends": "Ends",
        "joinedServer": "Joined in server at",
        "joinedDiscord": "Joined in Discord at",
        "roles": "Roles",
        "muted": "Muted",
        "unmute": "Unmute",
        "reason": "Reason"
    },
    "messageEmbed": {
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
    },
    "messageActionRow": {
        "confirmButtons": {
            "successLabel": "Yes",
            "dangerLabel": "No"
        }
    },
    "error": {
        "unknown": "Sorry 😢, i found a weird bug 🪲, i'm going kill it!",
        "50007": "Can't send private message to this member.",
        "50013": "Make sure I have this permission enabled on my job title, or also try moving my job higher in the job list hierarchy."
    },
    "interaction": {
        "welcomeGuild": "Hello you invite me to join in your guild, i hope to help you :3\nIf you wanna see my commands just use {bot.@mention} help or !help",
        "cannotSendPrivateMessage": "I could't send your message, 😢sorry.",
        "iDontKnowThisArgument": "I don't know this argument",
        "isDMMessage": "Can only be used on guilds.",
        "needArguments": "I need more arguments.",
        "youCantUseThisButton": "This button has a powerful magic that prevents you from using it!",
        "iDidntFoundAnything": "I couldn't find anything.",
        "youDontHavePermission": "You are not allowed to do it.",
        "needARole": "I need the server to have a role called {role}.",
        "member": {
            "kickCanceled": "Safe, you won't be kicked ❤️",
            "kickFromServer": "KIC-KA-DO hahaha 😈",
            "isNotKickable": "My attack had no effect, i couldn't kick him.",
            "notFound": "I couldn't find this member :c",
            "total": "Total members"
        }
    },
    "command": {
        "help": {
            "description": "I will teach you how to use my commands.",
            "usage": {
                "list": {
                    "arg": "list",
                    "description": "I will list all my secret commands.",
                    "example": "`{bot.prefix}help list` - List all commands by category."
                },
                "commandExample": "`{bot.prefix}help who` - How to use a specific command `{bot.prefix}who`"
            }
        },
        "anonymousDirectMessage": {
            "description": "I will send a direct message anonymously to any guild member.",
            "usage": {
                "messageExample": "`{bot.prefix}anonymous-direct-message @{bot.name} HIII it's time to SLIME PUNCH!👊💢` - Sends a direct message to @{bot.name}."
            }
        },
        "ban": {
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
                "days": {
                    "description": "Number of days between \"1 and 7\" representing messages to be deleted, default value is 0.",
                    "example": "`{bot.prefix}ban @{bot.name} --days \"1\"` - You can use the flag [--days | -d] and the quantity of days between quotes."
                },
                "reason": {
                    "description": "The reason for the ban.",
                    "example": "`{bot.prefix}ban @{bot.name} --reason \"Poing is distracting guild members.\"` - You can use [--reason | -r] and the reason of ban between quotes."
                },
                "memberExample": "`{bot.prefix}ban @{bot.name}` - Member can use `[@Mention | MemberID]` as reference.",
            }
        },
        "kick": {
            "description": "I will kick a guild member.",
            "error": {
                "50007": "Unable to notify member of your kick."
            },
            "usage": {
                "memberExample": "`{bot.prefix}kick @{bot.name}` - Member @{bot.name} has been kicked from the guild.",
                "reasonExample": "`{bot.prefix}kick @{bot.name} Poing is distracting guild members` - Add a reason to kick the member."
            }
        },
        "removeMessages": {
            "description": "Delete messages that were sent within 2 weeks.",
            "interaction": {
                "deletedMessages": "✉️ deletedMessageSize} messages were deleted."
            },
            "usage": {
                "quantityExample": "`{bot.prefix}remove-messages 10` - Delete 10 messages."
            }
        },
        "unban": {
            "description": "Unban a guild member.",
            "interaction": {
                "totalOfPages": "Total of pages: ",
                "memberUnbaned": "{authorMention} unbanned the member {unbanedMember}",
                "cantUnban": "I couldn't unban the member, sorry TwT"
            },
            "usage": {
                "list": {
                    "arg": "list",
                    "description": "List banned guild members.",
                    "example": "`{bot.prefix}unban list` - Banned members."
                },
                "member": {
                    "arg": "memberId",
                    "description": "Member ID to be unbaned.",
                    "example": "`{bot.prefix}unban 123456789` - Now the member can back to guild."
                },
                "reasonExample": "`{bot.prefix}unban 12356486 He paid bribe` - Reason for unban."
            }
        },
        "getMembersStatus": {
            "description": "Will return the amount of players online, away, dnd and offline."
        },
        "ping": {
            "interaction": {
                "clientPing": "Time to edit message:",
                "serverPing": "Discord ping: {ping.server}ms."
            },
            "description": "I will send you the response time in milliseconds(ms) of my services."
        },
        "userInfo": {
            "description": "I will search info about any member in the server.",
            "usage": {
                "exampleMember": "`{bot.prefix}userinfo @{bot.name}`- I will show you info about {bot.name}."
            }
        },
        "mute": {
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
                    "example": "`{bot.prefix}mute @{bot.name} It's too violent` - Mute member indefinitely with a reason."
                },
                "addRole": {
                    "description": "Add a role to use to punish a member.",
                    "example": "`{bot.prefix}mute addrole @Role` - Added new role to mute members as punishment."
                },
                "list": {
                    "description": "List the 50 closest members to ending the punishment.",
                    "example": "`{bot.prefix}mute list` - List members by [Name] | [Time to end the punishment]"
                },
                "exampleMember": "`{bot.prefix}mute @{bot.name}` - Mute member.",
                "exampleTime": "`{bot.prefix}mute @{bot.name} 10M` - Member @{bot.name} has been muted for 10 minutes.",
            }
        }
    },
    "usage": {
        "flag": {
            "-reason": {
                "description": "The flag can be used `[ -reason | --r ]`. Here you add a reason for the action you are taking, otherwise I will do such an action \"no reason\"."
            }
        },
        "argument": {
            "member": {
                "description": "Reference of any member."
            },
            "command": {
                "arg": "command",
                "description": "The reference of some command that is in my list."
            },
            "message": {
                "arg": "message",
                "description": "Message that will be sent to the member."
            },
            "reason": {
                "arg": "reason",
                "description": "Here you add a reason for the action you are doing."
            },
            "quantity": {
                "arg": "quantity",
                "description": "Enter the desired amount."
            },
            "time": {
                "arg": "time",
                "description": "Duration can be used by typing a number and using M for minutes, H for hours and D for days."
            }
        }
    }
}

export default en_US;