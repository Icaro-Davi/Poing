import { BaseModule, BaseWelcomeMemberModule } from "../../baseLocale/module.type";

const welcomeMember: BaseWelcomeMemberModule = {
    "messageText": "**👋 Bem vindo {member.mention} \nDivirta-se conosco!!**",
    "messageEmbed": {
        "author": { "name": "{member.username}", "picture": "{member.picture}" },
        "title": "👋 Olá {member.username}",
        "description": "Bem vindo ao servidor.",
        "thumbnail": "{member.picture}",
        "footer": "Divirta-se!!"
    }
}

const modules: BaseModule = {
    welcomeMember
}

export default modules;