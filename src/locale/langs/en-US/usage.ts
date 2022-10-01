import { BaseUsage } from "../../baseLocale/usage.type";

const usage: BaseUsage = {
    "flag": {
        "-reason": {
            "description": "The flag can be used `[ -reason | --r ]`. Here you add a reason for the action you are taking, otherwise I will do such an action \"no reason\"."
        }
    },
    "argument": {
        "member": {
            "description": "Can be Mention or MemberID."
        },
        "command": {
            "description": "The reference of some command that is in my list."
        },
        "message": {
            "description": "Message that will be sent to the member."
        },
        "reason": {
            "description": "Here you add a reason for the action you are doing."
        },
        "quantity": {
            "description": "Enter the desired amount."
        },
        "time": {
            "description": "Duration can be used by typing a number and using M for minutes, H for hours and D for days."
        }
    }
}

export default usage;