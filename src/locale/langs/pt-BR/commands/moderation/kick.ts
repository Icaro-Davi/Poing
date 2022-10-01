import type { BaseKickCommand } from "../../../../baseLocale/commands/moderation/kick.type";

const kick: BaseKickCommand = {
    "description": "Irei tira um membro do servidor e mandarei uma mensagem privada para o membro kickado.",
    "error": {
        "50007": "Não consegui avisar a esse membro que foi kickado."
    }
}

export default kick;