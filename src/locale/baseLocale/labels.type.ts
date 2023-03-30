import { PermissionFlagsBits } from "discord.js";

export type BaseLabels = {
    nickname: string;
    name: string;
    ends: string;
    expired: string;
    joinedServer: string;
    joinedDiscord: string;
    roles: string;
    muted: string;
    unmute: string;
    reason: string;
    usedCommand: string;  // vars: {command}
    added: string;
    active: string;
    removed: string;
    disabled: string;
    canceled: string;
    cancel: string;
    finished: string;
    finish: string;
    roleName: Partial<Record<keyof typeof PermissionFlagsBits, string>>;
    yes: string;
    no: string;
    used: string;
    members: string;
    member: string;
}