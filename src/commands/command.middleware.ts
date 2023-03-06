import { DiscordBot } from "../config";
import { createCommandBotLog, CreateCommandBotLogParamAction } from "../utils/creteBotLog";
import { BotCommand, ExecuteCommand, ExecuteCommandOptions, ExecuteSlashCommand } from "./index.types";

type BindNextMiddleware = (error?: string) => Promise<void>;
export type MiddlewareCommandFunc = (this: BotCommand, ...params: [...Parameters<ExecuteCommand>, BindNextMiddleware]) => any;
export type MiddlewareSlashCommandFunc = (this: BotCommand, ...params: [...Parameters<ExecuteSlashCommand>, BindNextMiddleware]) => any
type MiddlewareListType = {
    'COMMAND': MiddlewareCommandFunc[];
    'COMMAND_INTERACTION': MiddlewareSlashCommandFunc[];
};

function createMiddlewareHandler<T extends any[]>(params: T, middlewareList: ((...params: [...T, BindNextMiddleware]) => any)[]) {
    return async function (this: BotCommand) {
        let index = 0;
        async function next(this: BotCommand, error?: string) {
            if (error) {
                console.log('Middleware Error:', error);
                return;
            }
            index++;
            if (index < middlewareList.length) {
                await middlewareList[index].call(this, ...[...params, next.bind(this)]);
            }
        }
        await middlewareList[0].call(this, ...[...params, next.bind(this)]);
    }
}

function runMiddleware(type: 'COMMAND', middlewareList: MiddlewareCommandFunc[]): ExecuteCommand;
function runMiddleware(type: 'COMMAND_INTERACTION', middlewareList: MiddlewareSlashCommandFunc[]): ExecuteSlashCommand;
function runMiddleware<T extends keyof MiddlewareListType>(type: T, middlewareList: MiddlewareListType[T]) {
    switch (type) {
        case 'COMMAND':
            return async function commandDefault(this: BotCommand, ...params: Parameters<ExecuteCommand>): ReturnType<ExecuteCommand> {
                const execMiddlewareList = createMiddlewareHandler(params, middlewareList as MiddlewareCommandFunc[]).bind(this);
                await execMiddlewareList.call(this);
            }
        case 'COMMAND_INTERACTION':
            return async function executeSlashCommand(this: BotCommand, ...params: Parameters<ExecuteSlashCommand>): ReturnType<ExecuteSlashCommand> {
                const execMiddlewareList = createMiddlewareHandler(params, middlewareList as MiddlewareSlashCommandFunc[]).bind(this);
                await execMiddlewareList.call(this);
            }
    }
}

export default runMiddleware;

export type MiddlewareCommandType = {
    'COMMAND': MiddlewareCommandFunc;
    'COMMAND_INTERACTION': MiddlewareSlashCommandFunc;
};

export const middleware = {
    create<T extends keyof MiddlewareCommandType>(type: T, callback: (...params: Parameters<MiddlewareCommandType[T]>) => ReturnType<MiddlewareCommandType[T]>): MiddlewareCommandType[T] {
        return callback as MiddlewareCommandType[T];
    },
    createGetArgument(commandCallback: MiddlewareCommandFunc, commandInteractionCallback: MiddlewareSlashCommandFunc): [MiddlewareCommandFunc, MiddlewareSlashCommandFunc] {
        return [commandCallback, commandInteractionCallback]
    },
    submitLog<T extends keyof MiddlewareCommandType>(
        type: T,
        callback?: (params: ExecuteCommandOptions['context']) => CreateCommandBotLogParamAction
    ): MiddlewareCommandType[T] {
        if (type === 'COMMAND') {
            const middleware: MiddlewareCommandFunc = async function (message, args, options, next) {
                const action = callback?.(options.context ?? {}) ?? {};
                if (message.member?.user) {
                    await createCommandBotLog({
                        command: this,
                        logChannelId: options.bot.channel?.logsId,
                        member: message.member?.user,
                        embedColor: parseInt(`${options.bot.hexColor}`.replace('#', ''), 16),
                        action: { ...action, userInput: message.content }
                    });
                }
                next();
            }
            return middleware as MiddlewareCommandType[T];
        }
        if (type === 'COMMAND_INTERACTION') {
            const middleware: MiddlewareSlashCommandFunc = async function (interaction, options, next) {
                const action = callback?.(options.context ?? {}) ?? {};
                await createCommandBotLog({
                    command: this,
                    logChannelId: options.bot.channel?.logsId,
                    member: interaction.user,
                    embedColor: parseInt(`${options.bot.hexColor}`.replace('#', ''), 16),
                    action: { ...action }
                });
                next();
            }
            return middleware as MiddlewareCommandType[T];;
        }
        throw new Error('Needs be "COMMAND" or "COMMAND_INTERACTION"');
    },

}
