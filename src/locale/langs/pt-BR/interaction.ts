import { BaseInteraction } from "../../baseLocale/interaction.type";

const interaction: BaseInteraction = {
    onlyNumbers: "Hmmm mestre??, so acho que esse argumento não é um número 🤨.",
    welcomeGuild: "Olá, me chamo {bot.name}, espero lhe ajudar na sua guild :3\nConfira a lista de magias secretas usando {bot.@mention} help ou !help",
    cannotSendPrivateMessage: "Eu não pude enviar sua mensagem, :C desculpe.",
    iDontKnowThisArgument: "Eu não conheço esse argumento",
    isDMMessage: "So posso ser usado em servidores.",
    needArguments: "Preciso de mais argumentos.",
    youCantUseThisButton: "Este botão possui uma magia muito forte que estar te impedindo de usar!",
    iDidntFoundAnything: "Não consegui encontrar nada.",
    youDontHavePermission: "Você não tem permissão para fazer isso.",
    needARole: "Preciso que o servidor tenha um cargo chamado {role}.",
    verifyTheArguments: "Argumento invalido, verifique o que foi passado para o comando.",
    member: {
        kickCanceled: "Salvo, não será mais kicado ❤️",
        kickFromServer: "KIC-KA-DO muhahahaha 😈",
        isNotKickable: "Meu attack não surtiu efeito, não consegui kickar ele.",
        notFound: "Eu não pude encontrar esse membro :c",
        total: "Total de membros"
    }
}

export default interaction;