import { ClientEvents } from "discord.js";

export function createNewModule<P extends Array<any>, R extends Promise<any>, K extends keyof ClientEvents,>(eventModule: K, module: (...args: P) => R) {
    return {
        validateEvent: (event: K, isActive: boolean) => {
            if (event === eventModule && isActive) return {
                exec: module
            }
            else return {
                exec: () => {}
            }
        }
    }
}