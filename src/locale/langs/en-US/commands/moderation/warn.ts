import { BaseWarnCommand } from "../../../../baseLocale/commands/moderation/warn.type";

const warn: BaseWarnCommand = {
    description: 'Send a warn to the member.',
    components: {
        verifyMemberArgument: {
            title: 'Check command argument',
            descriptionVerifySecondArgPosition: 'Make sure you mentioned a member or used a valid member ID in the {argument_position} argument.'
        }
    },
    interaction: {
        messageSubmit: 'Warning message sent.'
    },
    usage: {
        args: {
            messageToSubmit: 'Message to submit to a member',
            memberThatWillReceiveWarning: 'The member who will receive the warning.',
            useFlagsToCreateMessageEmbed: 'Send a warning using message embed.'
        }
    }
}

export default warn;