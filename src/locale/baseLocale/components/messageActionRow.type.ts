export interface BaseConfirmButtons {
    successLabel: string;
    dangerLabel: string;
}

export interface BaseMessageActionRow {
    confirmButtons: BaseConfirmButtons;
    getHelpButton: string;
}