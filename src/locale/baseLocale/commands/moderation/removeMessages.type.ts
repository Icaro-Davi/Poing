export type BaseRemoveMessagesCommand = {
    description: string;
    interaction: {
        deletedMessages: string;
    }
}