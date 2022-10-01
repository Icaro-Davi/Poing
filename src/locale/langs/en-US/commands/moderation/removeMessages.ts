import { BaseRemoveMessagesCommand } from "../../../../baseLocale/commands/moderation/removeMessages.type";

const removeMessages: BaseRemoveMessagesCommand = {
    "description": "Delete messages that were sent within 2 weeks.",
    "interaction": {
        "deletedMessages": "✉️ {deletedMessageSize} messages were deleted."
    }
}

export default removeMessages;