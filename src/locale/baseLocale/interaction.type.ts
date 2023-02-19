export interface BaseMember {
    kickCanceled: string;
    kickFromServer: string;
    isNotKickable: string;
    notFound: string;
    botDoesNotHavePermission: string;
    total: string;
}

export interface BaseInteraction {
    onlyNumbers: string;
    welcomeGuild: string; // {bot.@mention}
    cannotSendPrivateMessage: string;
    iDontKnowThisArgument: string;
    isDMMessage: string;
    needArguments: string;
    youCantUseThisButton: string;
    iDidntFoundAnything: string;
    youDontHavePermission: string;
    botDontHavePermissions: string; // {role}
    needARole: string;// {role}
    verifyTheArguments: string;
    member: BaseMember;
}