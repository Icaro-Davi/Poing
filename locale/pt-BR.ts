import { Locale } from "../src/locale";

const pt_BR: Locale = {
    "localeLabel": "pt-BR",
    "category": {
        "label": "Categoria",
        "administration": "Administração",
        "moderation": "Moderação",
        "utility": "Utilitários"
    },
    "status": {
        "online": "Online",
        "idle": "Ausente",
        "dnd": "Não pertube",
        "offline": "Offline",
        "invisible": "Invisível"
    },
    "labels": {
        "nickname": "Apelido",
        "name": "Nome",
        "ends": "Acaba",
        "joinedServer": "Entrou no servidor",
        "joinedDiscord": "Entrou no Discord",
        "roles": "Cargos",
        "muted": "Silenciado",
        "unmute": "Desmuta",
        "reason": "Motivo"
    },
    "messageEmbed": {
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
    },
    "messageActionRow": {
        "confirmButtons": {
            "successLabel": "Sim",
            "dangerLabel": "Não"
        }
    },
    "error": {
        "unknown": "Desculpe 😢, achei um bug estranho 🪲 irei tentar mata-lo.",
        "50007": "Não posso enviar mensagem privada para esse membro.",
        "50013": "Verifique se tenho habilitado essa permissão no meu cargo, ou tente também mover meu cargo em uma posição mais alta na hierarquia da lista de cargos."
    },
    "interaction": {
        "onlyNumbers": "Hmmm mestre??, so acho que esse argumento não é um número 🤨.",
        "welcomeGuild": "Olá, me chamo {bot.name}, espero lhe ajudar na sua guild :3\nConfira a lista de magias secretas usando {bot.@mention} help ou !help",
        "cannotSendPrivateMessage": "Eu não pude enviar sua mensagem, :C desculpe.",
        "iDontKnowThisArgument": "Eu não conheço esse argumento",
        "isDMMessage": "So posso ser usado em servidores.",
        "needArguments": "Preciso de mais argumentos.",
        "youCantUseThisButton": "Este botão possui uma magia muito forte que estar te impedindo de usar!",
        "iDidntFoundAnything": "Não consegui encontrar nada.",
        "youDontHavePermission": "Você não tem permissão para fazer isso.",
        "needARole": "Preciso que o servidor tenha um cargo chamado {role}.",
        "member": {
            "kickCanceled": "Salvo, não será mais kicado ❤️",
            "kickFromServer": "KIC-KA-DO muhahahaha 😈",
            "isNotKickable": "Meu attack não surtiu efeito, não consegui kickar ele.",
            "notFound": "Eu não pude encontrar esse membro :c",
            "total": "Total de membros"
        }
    },
    "command": {
        "help": {
            "description": "Recebe a descrição de algum comando quando usado.",
            "usage": {
                "list": {
                    "arg": "list",
                    "description": "Irei listar todos os comandos e suas categorias.",
                    "example": "`{bot.prefix}help list` - Listarei todos os meus comandos por categoria."
                },
                "commandExample": "`{bot.prefix}help who` - Irá retornar o manual de como usar o comando `{bot.prefix}who`"
            }
        },
        "anonymousDirectMessage": {
            "description": "Envia uma mensagem anonimamente para um membro do server através de mim.",
            "usage": {
                "messageExample": "`{bot.prefix}anonymous-direct-message @{bot.name} Oi você quer pular pelo meu servidor ?` - Envia uma mensagem privada para @{bot.name}."
            }
        },
        "ban": {
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
                    "example": "`{bot.prefix}ban list` - Lista com todos os banidos."
                },
                "days": {
                    "description": "Número de dias entre \"1 e 7\" que representa as mensagens que serão deletadas, valor padrão é 0.",
                    "example": "`{bot.prefix}ban @{bot.name} --days \"7\" ` - A flag de days pode ser usada `[ -d | --days ]` em seguida o valor entre aspas duplas."
                },
                "reason": {
                    "description": "A razão do banimento.",
                    "example": "`{bot.prefix}ban @{bot.name} -reason \"Poing está distraindo os membros do servidor.\"` - O membro {bot.name} foi banido com um motivo.",
                },
                "memberExample": "`{bot.prefix}ban @{bot.name}` - Member @{bot.name} has been banned from the guild.",
            }
        },
        "kick": {
            "description": "Irei tira um membro do servidor e mandarei uma mensagem privada para o membro kickado.",
            "error": {
                "50007": "Não consegui avisar a esse membro que foi kickado."
            },
            "usage": {
                "memberExample": "`{bot.prefix}kick @{bot.name}` - Irei dar kick em um membro.",
                "reasonExample": "`{bot.prefix}kick @{bot.name} Poing está distraindo os membros do servidor` - Adiciona um motivo para dar kick no @{bot.name}."
            }
        },
        "removeMessages": {
            "description": "Deleto mensagens que foram enviadas em até 2 semanas.",
            "interaction": {
                "deletedMessages": "✉️ Deletei {deletedMessageSize} mensagens."
            },
            "usage": {
                "quantityExample": "`{bot.prefix}remove-messages 10` - Remove 10 mensagens."
            }
        },
        "unban": {
            "description": "Desbanir um membro do servidor.",
            "interaction": {
                "totalOfPages": "Total de páginas: ",
                "memberUnbaned": "{authorMention} desbaniu o membro {unbanedMember}",
                "cantUnban": "Não consegui desbanir o membro, desculpa TwT"
            },
            "usage": {
                "member": {
                    "arg": "membroId",
                    "description": "Id do usurário que será desbanido.",
                    "example": "`{bot.prefix}unban 123456789` - Agora {bot.name} pode voltar ao servidor."
                },
                "reasonExample": "`{bot.prefix}unban 12356486 Ele pagou propina` - Motivo do desbanimento."
            }
        },
        "getMembersStatus": {
            "description": "Irá retornar a quantidade de players online, ausente, não pertube e offline."
        },
        "ping": {
            "interaction": {
                "clientPing": "Ping do cliente:",
                "serverPing": "@{bot.name} para o API do discord: {ping.server}ms."
            },
            "description": "Enviarei para você o tempo de resposta em milissegundos(ms) dos meus serviços."
        },
        "info": {
            "description": "Buscarei informações sobre algum membro da guild.",
            "usage": {
                "exampleMember": "`{bot.prefix}info member @{bot.name}`- Retornarei informações sobre o membro @{bot.name}."
            }
        },
        "mute": {
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
                    "example": "`{bot.prefix}mute @{bot.name} Não para de pular na frente dos membros` - Vai mutar o {bot.name} por tempo indeterminado, com um motivo/razão."
                },
                "addRole": {
                    "description": "Quando um membro for mutado usarei esse cargo como punição.",
                    "example": "`{bot.prefix}mute addrole @Cargo`. Registra um cargo assim eu irei usar para mutar os membros do servidor hehe."
                },
                "list": {
                    "description": "Lista os 50 membros mais próximos de acabar a punição.",
                    "example": "`{bot.prefix}mute list` - Lista os membros por [Nome] | [Tempo para acabar punição]"
                },
                "exampleMember": "`{bot.prefix}mute @{bot.name}` - Muta o membro forever :3.",
                "exampleTime": "`{bot.prefix}mute @{bot.name} 10M` - O membro @{bot.name} foi mutado por 10 Minutos.",
            }
        }
    },
    "usage": {
        "flag": {
            "-reason": {
                "description": "A flag pode ser usado `[ -reason | --r ]`. Aqui você adiciona um motivo a ação que estar tomando, se não por eu irei fazer tal ação sem motivo."
            }
        },
        "argument": {
            "member": {
                "description": "A referência de algum membro do servidor, pode ser `[menção | membroId]`."
            },
            "command": {
                "arg": "comando",
                "description": "A referência de algum comando que está na minha lista."
            },
            "message": {
                "arg": "mensagem",
                "description": "Mensagem que será enviada para o membro."
            },
            "reason": {
                "arg": "motivo",
                "description": "Aqui você adiciona um motivo a ação que estar fazendo."
            },
            "quantity": {
                "description": "Insira a quantidade desejada."
            },
            "time": {
                "arg": "tempo",
                "description": "A duração pode ser usado informando um número e em seguida com M para minutos, H para horas e D para dias."
            }
        }
    }
}

export default pt_BR;