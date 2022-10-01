import { BaseUsage } from "../../baseLocale/usage.type";

const usage: BaseUsage = {
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
            "description": "A referência de algum comando que está na minha lista."
        },
        "message": {
            "description": "Mensagem que será enviada para o membro."
        },
        "reason": {
            "description": "Aqui você adiciona um motivo a ação que estar fazendo."
        },
        "quantity": {
            "description": "Insira a quantidade desejada."
        },
        "time": {
            "description": "A duração pode ser usado informando um número e em seguida com M para minutos, H para horas e D para dias."
        }
    }
}

export default usage;