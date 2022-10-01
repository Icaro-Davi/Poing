import { BaseRemoveMessagesCommand } from "../../../../baseLocale/commands/moderation/removeMessages.type";

const removeMessages: BaseRemoveMessagesCommand = {
    "description": "Deleto mensagens que foram enviadas em até 2 semanas.",
    "interaction": {
        "deletedMessages": "✉️ Deletei {deletedMessageSize} mensagens."
    }
}

export default removeMessages;