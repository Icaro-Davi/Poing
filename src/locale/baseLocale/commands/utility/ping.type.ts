export type BasePingCommand = {
    description: string;
    interaction: {
        clientPing: string;
        serverPing: string;
    }
};