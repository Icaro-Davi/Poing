export type BaseWarnCommand = {
    description: string;
    components: {
        verifyMemberArgument: {
            title: string;
            descriptionVerifySecondArgPosition: string;
        }
    };
    interaction: {
        messageSubmit: string;
    }
    usage: {
        args: {
            messageToSubmit: string;
            useFlagsToCreateMessageEmbed: string;
            memberThatWillReceiveWarning: string;
        }
    }
}