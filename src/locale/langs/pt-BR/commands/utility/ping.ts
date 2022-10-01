import { BasePingCommand } from "../../../../baseLocale/commands/utility/ping.type";

const ping: BasePingCommand = {
    "interaction": {
        "clientPing": "Ping do cliente:",
        "serverPing": "@{bot.name} para o API do discord: {ping.server}ms."
    },
    "description": "Enviarei para você o tempo de resposta em milissegundos(ms) dos meus serviços."
}

export default ping;