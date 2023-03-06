import { BaseWarnCommand } from "../../../../baseLocale/commands/moderation/warn.type";

const warn: BaseWarnCommand = {
    description: 'Manda um aviso para o membro, esses avisos serão contabilizados e registrados em um canal de texto.',
    components: {
        verifyMemberArgument: {
            title: 'Verifique o argumento do comando',
            descriptionVerifySecondArgPosition: 'Verifique se mencionou um membro ou usou o Id de membro valido no {argument_position} argumento'
        }
    },
    interaction: {
        messageSubmit: 'Mensagem de aviso enviada.'
    },
    usage: {
        args: {
            messageToSubmit: 'Mensagem de aviso.',
            memberThatWillReceiveWarning: 'O membro que irá receber o aviso.',
            useFlagsToCreateMessageEmbed: 'Mande um aviso usando a mensagem incorporada para o membro.'
        }
    }
}

export default warn;