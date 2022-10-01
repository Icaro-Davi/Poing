import { BaseUnbanCommand } from "../../../../baseLocale/commands/moderation/unban.type";

const unban: BaseUnbanCommand ={
    "description": "Desbanir um membro do servidor.",
    "interaction": {
        "totalOfPages": "Total de páginas: ",
        "memberUnbaned": "{authorMention} desbaniu o membro {unbanedMember}",
        "cantUnban": "Não consegui desbanir o membro, desculpa TwT"
    },
    "usage": {
        "member": {
            "description": "Id do usurário que será desbanido.",
        }
    }
}

export default unban;