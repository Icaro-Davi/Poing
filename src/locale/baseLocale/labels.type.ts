import { PermissionFlagsBits } from "discord.js";

export type BaseLabels = {
    nickname: string;
    name: string;
    ends: string;
    joinedServer: string;
    joinedDiscord: string;
    roles: string;
    muted: string;
    unmute: string;
    reason: string;
    usedCommand: string;  // vars: {command}
    added: string;
    removed: string;
    roleName: Partial<Record<keyof typeof PermissionFlagsBits, string>>;
}