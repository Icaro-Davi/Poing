export type BaseGetHelp = {
    title: string;
    fieldHowToUse: string;
    fieldAliases: string;
    fieldArguments: string;
    fieldExamples: string;
}

export type BasePrivateMessage = {
    title: string;
    description: string;
    footer: string;
}

export type BaseConfirmBanishMember = {
    title: string;
    fieldNameDays: string;
    fieldDays: string;
    fieldReason: string;
}

export type BaseConfirmKickMember = {
    title: string;
    fieldReason: string;
}

export type BaseMessageToBanishedMember = {
    title: string;
    fieldReason: string;
    banWithoutReason: string;
}

export type BaseMemberStatus = {
    title: string;
}

export type BaseMessageEmbed = {
    getHelp: BaseGetHelp;
    privateMessage: BasePrivateMessage;
    confirmBanishMember: BaseConfirmBanishMember;
    confirmKickMember: BaseConfirmKickMember;
    messageToBanishedMember: BaseMessageToBanishedMember;
    memberStatus: BaseMemberStatus;
}