/**
 * BaseWelcomeMemberModule Variables, e.g: "The member name is {member.username}"
 *
 * @type BaseWelcomeMemberModule
 * @bot { prefix hexColor name \@mention }
 * @member \{ username tagNumber picture mention joinedAt }
 * @guild { name picture }
 */
export type BaseWelcomeMemberModule = {
    messageText: string;
    messageEmbed: {
        author: {
            name: string;
            picture: string;
        };
        title: string;
        thumbnail: string;
        description: string;
        footer: string;
    }
}

export interface BaseModule {
    welcomeMember: BaseWelcomeMemberModule;
}