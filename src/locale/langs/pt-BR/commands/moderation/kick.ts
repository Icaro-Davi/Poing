import type { BaseKickCommand } from "../../../../baseLocale/commands/moderation/kick.type";

const kick: BaseKickCommand = {
    "description": "Irei tira um membro do servidor e mandarei uma mensagem privada para o membro kickado.",
    "embeds": {
        "kickMassInteraction": {
            "confirmation": {
                "title": "Confirmação",
                "description": "Escolhidos",
                "field": {
                    "voteState": {
                        "title": "Estado da Votação",
                    }
                }
            },
            "createKickMass": {
                "title": "Kick em massa",
                "description": "Selecione os membros que quer kickar, mas cuidado esse comando é muito poderoso, por conta disso usaremos apenas 10% de seu poder, se o membro não estiver na lista de escolhidos é porque não é kickavel por possuir privilégios.",
                "field": {
                    "cancel": {
                        "description": "Vamos parar por aqui a brincadeira acabou por enquanto, foi so zoeira."
                    },
                    "selectMember": {
                        "description": "Você pode selecionar os membros que deseja kickar porém apenas 10 serão aceitos, se não ser exibido é porque não tenho permissão para kickar."
                    },
                    "vote": {
                        "description": "Ativa ou Desativa o modo votação, que os jogos comecem e as almas selecionadas sejam julgadas perante o olho do slime ceifador."
                    }
                },
                "footer": "Será cancelado em {time} minutos por inatividade"
            }
        },
        "voteKickMassInteraction": {
            "title": "Expulsar os membros?",
            "footer": "O resultado será daqui a {time} minutos."
        },
        "resultVoteYes": {
            "title": "Resultado",
            "description": "Segue abaixo a lista dos expulsos"
        },
        "resultVoteNo": {
            "title": "Resultado",
            "description": "Ninguém foi expulso hoje"
        }
    },
    "components": {
        "activeVote": "Ativar Votação",
        "disableVote": "Desativar Votação",
        "selectMembers": "Selecionar Membros",
    },
    "error": {
        "50007": "Não consegui avisar a esse membro que foi kickado."
    }
}

export default kick;