import { DiscordAPIError } from "discord.js";
import { Locale } from "../locale";
import { createCommandBotLog, CreateCommandBotLogParamAction } from "../utils/creteBotLog";
import CommandError, { CommandErrorType } from "./command.error";
import { BotCommand, ExecuteCommand, ExecuteCommandOptions, ExecuteSlashCommand } from "./index.types";

type BindNextMiddleware = (error?: CommandErrorType) => Promise<void>;
export type MiddlewareCommandFunc = (this: BotCommand, ...params: [...Parameters<ExecuteCommand>, BindNextMiddleware]) => any;
export type MiddlewareSlashCommandFunc = (this: BotCommand, ...params: [...Parameters<ExecuteSlashCommand>, BindNextMiddleware]) => any
type MiddlewareListType = {
    'COMMAND': MiddlewareCommandFunc[];
    'COMMAND_INTERACTION': MiddlewareSlashCommandFunc[];
};

function createMiddlewareHandler<T extends (Parameters<ExecuteCommand> | Parameters<ExecuteSlashCommand>)>(params: T, pipeline: ((...params: [...T, BindNextMiddleware]) => Promise<void> | void)[]) {
    return async function (this: BotCommand) {
        // const pipelineContext = { cancelled: false }
        new Promise<boolean>((resolve, reject) => {
            const next = async function (this: BotCommand, error?: Omit<CommandErrorType, 'commandParams' | 'slashCommandParams'> | Omit<CommandError, 'commandParams' | 'slashCommandParams'>) {
                if (error) {
                    pipeline = [];
                    if (error instanceof CommandError) {
                        reject(error);
                    } else {
                        const _error = {
                            ...error, ...params.length === 3 ? { commandParams: params } : {},
                            ...params.length === 2 ? { slashCommandParams: params } : {},
                        }
                        reject(new CommandError(_error as CommandErrorType));
                    }
                } else {
                    try {
                        const middleware = pipeline.shift();
                        if (middleware) {
                            await middleware.call(this, ...[...params, next.bind(this)]);
                        } else {
                            resolve(true);
                        }
                    } catch (error) {
                        reject(error);
                    }
                }
            }
            next.call(this).catch(err => {
                reject(err)
            });
        }).catch((err: CommandErrorType | CommandError | any) => {
            if (err instanceof CommandError)
                return err.throwError();

            let commandParams: Parameters<ExecuteCommand> | undefined;
            let slashCommandParams: Parameters<ExecuteSlashCommand> | undefined;
            if (params.length === 2) {
                slashCommandParams = params;
            } else if (params.length === 3) {
                commandParams = params;
            }
            const errorObject = {
                ...params.length === 3 ? { commandParams } : {},
                ...params.length === 2 ? { slashCommandParams } : {},
                error: err,
            }
            const locale = (commandParams?.[2].locale ?? slashCommandParams?.[1].locale) as Locale;
            if (err instanceof DiscordAPIError) {
                new CommandError({
                    type: 'DISCORD_API', ...errorObject, message: {
                        content: locale.error[err.code as keyof Locale['error']] ?? locale.error.unknown
                    }
                }).throwError();
            } else {
                new CommandError({
                    type: 'UNKNOWN', ...errorObject, error: err, message: {
                        content: locale.error.unknown
                    }
                }).throwError();
            }
        });
    }
}

function createPipeline(type: 'COMMAND', middlewareList: MiddlewareCommandFunc[]): ExecuteCommand;
function createPipeline(type: 'COMMAND_INTERACTION', middlewareList: MiddlewareSlashCommandFunc[]): ExecuteSlashCommand;
function createPipeline<T extends keyof MiddlewareListType>(type: T, middlewareList: MiddlewareListType[T]) {
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

export default createPipeline;

export type MiddlewareCommandType = {
    'COMMAND': MiddlewareCommandFunc;
    'COMMAND_INTERACTION': MiddlewareSlashCommandFunc;
};

function createMiddleware<T extends keyof MiddlewareCommandType>(type: T, callback: (this: BotCommand, ...params: Parameters<MiddlewareCommandType[T]>) => ReturnType<MiddlewareCommandType[T]>): MiddlewareCommandType[T] {
    return callback as MiddlewareCommandType[T];
}

export const middleware = {
    create: createMiddleware,
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
                        embedColor: options.bot.hexColor,
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
                    embedColor: options.bot.hexColor,
                    action: { ...action }
                });
                next();
            }
            return middleware as MiddlewareCommandType[T];
        }
        throw new Error('Needs be "COMMAND" or "COMMAND_INTERACTION"');
    },
    DEVELOPMENT: {
        logContext<T extends keyof MiddlewareCommandType>(type: T, stop?: boolean): MiddlewareCommandType[T] {
            if (type === 'COMMAND') {
                const middleware = createMiddleware('COMMAND', async function (message, args, options, next) {
                    console.log(`[LOG] ${this.name}`, options.context);
                    if (stop) {
                        next({ type: 'UNKNOWN' }); return;
                    }
                    next();
                });
                return middleware as MiddlewareCommandType[T];
            }
            if (type === 'COMMAND_INTERACTION') {
                const middleware = createMiddleware('COMMAND_INTERACTION', async function (interaction, options, next) {
                    console.log(`[LOG] ${this.name}`, options.context);
                    if (stop) {
                        next({ type: 'UNKNOWN' }); return;
                    }
                    next();
                });
                return middleware as MiddlewareCommandType[T];
            }
            throw new Error('Needs be COMMAND or COMMAND_INTERACTION type');
        }
    }
}
