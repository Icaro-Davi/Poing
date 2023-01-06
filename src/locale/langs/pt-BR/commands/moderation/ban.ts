import { BaseBanCommand } from "../../../../baseLocale/commands/moderation/ban.type";

const ban: BaseBanCommand = {
    "description": "Irei banir um membro do servidor e mandarei uma mensagem privada para o membro banido avisando do banimento.",
    "error": {
        "50007": "Não consegui avisar a esse membro que foi banido.",
        "mustBeNumber": "Só aceito números.",
        "numberMustBeBetweenTwoValues": "Hmm so aceito números entre 1 e 7 UwU.",
    },
    "interaction": {
        "isNotBannable": "Esse membro é muito poderoso, não consigo banir ele T-T",
        "banishedCanceled": "Banimento cancelado ❤️",
        "banishedFromServer": "Banido 😈",
        "bannedWithNoReason": "Sem Motivo."
    },
    "usage": {
        "list": {
            "description": "Irei mostrar a lista dos banidos do servidor.",

        },
        "soft_ban": {
            "description": "Aplica ban em um membro temporariamente e depois desfaz o ban, isso faz com que todas as mensagens desse membro sejam deletadas do servidor."
        },
        "days": {
            "description": "Número de dias entre \"1 e 7\" que representa as mensagens que serão deletadas, valor padrão é 0.",

        },
        "reason": {
            "description": "A razão do banimento.",
        },
    }
}

export default ban;