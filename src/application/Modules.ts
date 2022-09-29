import type { IWelcomeMemberModuleSettings } from "../domain/modules/welcomeModule/WelcomeModule.schema";

class Modules {

    static async getWelcomeConfig(guildId: string) {
        return new Promise<IWelcomeMemberModuleSettings>((resolve, reject) => {
            setInterval(() => resolve({
                isMessageText: false,
                channelId: '1024774617073733743',
                messageText: '👋 **Olá {member.mention}** \nBem vindo ao servidor. \n\nDivirta-se!!',
                messageEmbed: {
                    author: { name: `{member.username}`, picture: '{member.picture}' },
                    title: `👋 Olá {member.username}`,
                    description: `Bem vindo ao servidor.`,
                    thumbnail: `{member.picture}`,
                    footer: 'Divirta-se!!',
                }
            }), 100);
        })
    }

}

export default Modules;