import { BaseMessageEmbed } from "../../../baseLocale/components/messageEmbed.type";

const messageEmbed: BaseMessageEmbed = {
    "getHelp": {
        "title": "Ajuda do comando: ",
        "fieldHowToUse": "Como usar",
        "fieldAliases": "Comando abreviado",
        "fieldArguments": "Argumentos",
        "fieldExamples": "Exemplos"
    },
    "privateMessage": {
        "title": "O carteiro {bot.name} chegou!",
        "description": "**O servidor {guild.name} enviou uma mensagem.**\n\n__{message}__",
        "footer": "Essa mensagem foi enviada por um dos administradores."
    },
    "confirmBanishMember": {
        "title": "Por favor confirme o banimento!",
        "fieldNameDays": "Dias",
        "fieldDays": "Deletando mensagens de **{days}** dias.",
        "fieldReason": "Motivo do banimento"
    },
    "confirmSoftBan": {
        "title": "Confirme o soft ban!",
        "description": "Ao apertar \"sim\" o membro será banido e desbanido ao mesmo tempo e suas mensagens de até 7 dias serão removidas."
    },
    "confirmKickMember": {
        "title": "Por favor confirme o kick!",
        "fieldReason": "Motivo do kick"
    },
    "messageToBanishedMember": {
        "title": "Você foi banido",
        "fieldReason": "Motivo do banimento",
        "banWithoutReason": "Sem motivo."
    },
    "memberStatus": {
        "title": "Lista de membros por status"
    }
}

export default messageEmbed;