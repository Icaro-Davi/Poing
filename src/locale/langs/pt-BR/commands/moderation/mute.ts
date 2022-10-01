import { BaseMuteCommand } from "../../../../baseLocale/commands/moderation/mute.type";

const mute: BaseMuteCommand = {
    "description": "Muta um membro do servidor",
    "interaction": {
        "invalidTime": "TIME argument is invalid, try again using e.g. 10M for minutes, 1H for hours, 7D for days",
        "noTimeSilencedMembers": "🙊 Não tem membros silenciados.",
        "mustBeNumber": "Precisa ser número",
        "mutedSuccessful": "O membro {memberMutedName} foi mutado por {author} e acabará {duration}.",
        "memberAlreadyMuted": "O membro já foi mutado, remova o cargo e tente novamente.",
        "needMuteRoleId": "Precisa me falar um cargo que eu possa \"Mutar\", use `!mute --a \"Nome do cargo | Id do cargo | @Cargo\"` para adicionar um.",
        "muteRoleAdded": "Irei lembrar esse cargo :3 até você me falar outro",
        "cannotRegisterRole": "Não consegui registrar esse cargo.",
        "roleNotFound": "Não encontrei esse cargo no servidor.",
        "needRegisterRole": "Precisa registrar um cargo, use `!help mute`",
        "cannotMuteAdmin": "Não consigo... esse membro... o poder dele é sem limites D:",
        "arg": {
            "time": {
                "day": "Não pode ser maior que 365 dias.",
                "hour": "`{timeArg}` - Não pode ser maior que 24 hora.",
                "minute": "{timeArg} - Não pode ser maior que 60 minutos.",
                "idk": "Não consegui entender {timeArg}{timeChar}"
            }
        }
    },
    "usage": {
        "reason": {
            "description": "Motivo para mutar o membro",
        },
        "addRole": {
            "description": "Quando um membro for mutado usarei esse cargo como punição.",
        },
        "list": {
            "description": "Lista os 50 membros mais próximos de acabar a punição.",
        },
    }
}

export default mute;