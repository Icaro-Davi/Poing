export interface BaseMember {
    kickCanceled: string;
    kickFromServer: string;
    isNotKickable: string;
    notFound: string;
    total: string;
}

export interface BaseInteraction {
    onlyNumbers: string;
    welcomeGuild: string;
    cannotSendPrivateMessage: string;
    iDontKnowThisArgument: string;
    isDMMessage: string;
    needArguments: string;
    youCantUseThisButton: string;
    iDidntFoundAnything: string;
    youDontHavePermission: string;
    needARole: string;
    verifyTheArguments: string;
    member: BaseMember;
}