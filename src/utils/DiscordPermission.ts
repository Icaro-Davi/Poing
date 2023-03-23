import { PermissionFlagsBits, PermissionResolvable } from "discord.js";

type PermissionFlagBitsKeys = keyof typeof PermissionFlagsBits;

const permissionBigIntToString = new Map<bigint, string>();
(permissionBigIntToString.size < 1)
    && Object.keys(PermissionFlagsBits).forEach(permissionKey => (permissionBigIntToString.set(PermissionFlagsBits[permissionKey as PermissionFlagBitsKeys], permissionKey)));

const PermissionStringToBits = function (permissionBits: PermissionResolvable): PermissionFlagBitsKeys | undefined {
    if (typeof permissionBits !== 'bigint') return;
    return permissionBigIntToString.get(permissionBits) as PermissionFlagBitsKeys;
}

const DiscordPermission = {
    stingToBits: PermissionStringToBits,
}

export default DiscordPermission;