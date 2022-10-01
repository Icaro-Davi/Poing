import { BasePingCommand } from "../../../../baseLocale/commands/utility/ping.type";

const ping: BasePingCommand = {
    "interaction": {
        "clientPing": "Time to edit message:",
        "serverPing": "Discord ping: {ping.server}ms."
    },
    "description": "I will send you the response time in milliseconds(ms) of my services."
}

export default ping;