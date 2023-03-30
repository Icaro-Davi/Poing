import { BaseKickCommand } from "../../../../baseLocale/commands/moderation/kick.type";

const kick: BaseKickCommand = {
    "description": "I will kick a guild member.",
    "embeds": {
        "kickMassInteraction": {
            "confirmation": {
                "title": "Confirmation",
                "description": "Selected",
                "field": {
                    "voteState": {
                        "title": "Voting Status",
                    }
                }
            },
            "createKickMass": {
                "title": "Mass Kick",
                "description": "Select the members you want to kick, but be careful this command is very powerful, because of that we will use only 10% of its power, if the member is not in the chosen list it is because it is not kickable for having privileges.",
                "field": {
                    "cancel": {
                        "description": "Let's stop here, the joke is over for now, it was just a joke."
                    },
                    "selectMember": {
                        "description": "You can select the members you want to kick but only 10 will be accepted, if it is not displayed it means I don't have permission to kick."
                    },
                    "vote": {
                        "description": "Activate or deactivate voting mode, let the games begin and the selected souls be judged before the eye of the reaper slime."
                    }
                },
                "footer": "Will be canceled in {time} minutes due to inactivity."
            }
        },
        "voteKickMassInteraction": {
            "title": "Expel the members?",
            "footer": "The result will be in {time} minutes."
        },
        "resultVoteYes": {
            "title": "Result",
            "description": "Below is the list of expelled members"
        },
        "resultVoteNo": {
            "title": "Result",
            "description": "Nobody got kicked out today"
        }
    },
    "components": {
        "activeVote": "Create Poll",
        "disableVote": "Disabled Poll",
        "selectMembers": "Select Members",
    },
    "error": {
        "50007": "Unable to notify member of your kick."
    }
}

export default kick;