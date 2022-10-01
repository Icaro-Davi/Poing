/**
 * Check reference to check vars
 *
 * @vars {authorMention unbanedMember}
 */

export type BaseUnbanCommand = {
    description: string;
    interaction: {
        totalOfPages: string;
        memberUnbaned: string; // [authorMention unbanedMember]
        cantUnban: string;
    };
    usage: {
        member: {
            description: string;
        };
    }
}