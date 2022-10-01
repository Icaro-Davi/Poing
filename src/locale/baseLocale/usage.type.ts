export type BaseUsage = {
    flag: {
        "-reason": {
            description: string;
        }
    }
    argument: {
        member: {
            description: string;
        }
        command: {
            description: string;
        }
        message: {
            description: string;
        }
        reason: {
            description: string;
        }
        quantity: {
            description: string;
        }
        time: {
            description: string;
        }
    }
}