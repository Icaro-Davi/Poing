import { BaseEmbedCommand } from "../../../../baseLocale/commands/utility/embed.type";

const embed: BaseEmbedCommand = {
    description: 'Cria uma mensagem incorporada.',
    createEmbedMessageExplanation: {
        title: 'Criar mensagem incorporada',
        description: 'Interaja com os botões para preencher as informações necessárias. Mais detalhes abaixo de como cada botão funciona. Será cancelado caso não tenha interação dentro de {minutes} minutos.',
        fields: {
            bodyBtn: { name: 'Preencher Corpo', value: 'Abre o formulário principal para preencher a mensagem incorporada.' },
            addItemBtn: { name: 'Adicionar Item', value: 'Adiciona um novo campo a mensagem incorporada. (Máximo 5 campos)' },
            deleteItemBtn: { name: 'Deletar Item', value: 'Deleta ultimo item adicionado.' },
            submitEmbedMessageBtn: { name: 'Finalizar', value: 'Finaliza a criação e gera a mensagem.' },
            cancelEmbedMessageBtn: { name: 'Cancelar', value: 'Cancela a criação da mensagem.' }
        }
    },
    component: {
        embedMessageForm: {
            messageBodyTitleModal: 'Corpo da mensagem',
            title: { label: 'Titulo', placeholder: 'Escreva alguma coisa...' },
            description: { label: 'Descrição', placeholder: 'Escreva a descrição...' },
            footer: { label: 'Rodapé', placeholder: 'Escreva a mensagem de rodapé...' },
            thumbnail: { label: 'Thumbnail', placeholder: 'Cole a URL aqui...' },
        },
        embedMessageFormField: {
            addNewFieldTitleModal: 'Adicionar novo campo',
            title: { label: 'Titulo do campo', placeholder: 'Escreva o titulo...' },
            description: { label: 'Descrição do campo', placeholder: 'Escreva uma descrição...' },
            inline: { label: 'Exibir campo em linha' }
        },
        haveInvalidFlags: {
            title: 'Você usou algumas flags invalidas'
        },
        incompleteFieldFlags: {
            title: 'Algumas flags podem está faltando ou escritas erradas',
            description: 'Verifique se você passou todas as flags relacionadas a {field_title} ou {field_value} corretamente.'
        },
        invalidThumbnailUrl: {
            title: 'URL invalida',
            description: 'Use uma URL valida ou remova a flag {flag_thumbnail}'
        }
    },
    interaction: {
        embedMessageCanceledByInactivity: 'Cancelado por inatividade.',
        embedMessageCreated: 'Mensagem incorporada criada.',
        embedMessageCreationCanceled: 'Cancelado.'
    },
    usage: {
        flag: {
            description: 'Flags para criar a mensagem incorporada'
        }
    }
}

export default embed;