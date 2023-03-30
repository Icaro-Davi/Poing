export type BaseKickCommand = {
    description: string;
    embeds: {
        kickMassInteraction: {
            confirmation: {
                title: string;
                description: string;
                field: {
                    voteState: {
                        title: string;
                    }
                }
            };
            createKickMass: {
                title: string;
                description: string;
                field: {
                    selectMember: {
                        description: string;
                    };
                    vote: {
                        description: string; // {emoji}
                    };
                    cancel: {
                        description: string;
                    };
                };
                footer: string; // {time}
            }
        },
        voteKickMassInteraction: {
            title: string;
            footer: string; // {time}
        },
        resultVoteYes: {
            title: string;
            description: string;
        };
        resultVoteNo: {
            title: string;
            description: string;
        };
    },
    components: {
        selectMembers: string;
        activeVote: string;
        disableVote: string;

    }
    error: {
        50007: string;
    };
};
