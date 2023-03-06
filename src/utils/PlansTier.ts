const PlansTier = {
    type: {
        FREE: 1 << 0,
        BASIC: 1 << 1
    },
    hasPermissions(permissionBits: number, permissions: (keyof typeof this.type)[]) {
        return permissions.every(permission => (permissionBits & this.type[permission]) == this.type[permission]);
    },
    createPermissionBits(permissions: (keyof typeof this.type)[]) {
        return permissions.reduce((prev, permission) => {
            prev += (this.type[permission]);
            return prev;
        }, 0);
    }
}

export default PlansTier;