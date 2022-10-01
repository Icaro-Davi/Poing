import { BaseModule, BaseWelcomeMemberModule } from "../../baseLocale/module.type";

const welcomeMember: BaseWelcomeMemberModule = {
    "messageText": "**👋 Welcome {member.mention} \nEnjoy yourself!!**",
    "messageEmbed": {
        "author": { "name": "{member.username}", "picture": "{member.picture}" },
        "title": "👋 Hello {member.username}",
        "description": "Welcome to the guild.",
        "thumbnail": "{member.picture}",
        "footer": "Enjoy yourself!!"
    }
}

const modules: BaseModule = {
    welcomeMember
}

export default modules;