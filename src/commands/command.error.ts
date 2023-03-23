import { Interaction, Message } from "discord.js";
import AnswerMember, { AnswerMemberParams } from "../utils/AnswerMember";
import { ExecuteCommand, ExecuteSlashCommand } from "./index.types";

interface CommandErrorDefault {
    logMessage?: string;
    origin?: string;
    error?: any;
}

interface UserCommandError extends CommandErrorDefault {
    type: 'COMMAND_USER' | 'DISCORD_API';
    commandParams?: Parameters<ExecuteCommand>;
    message: AnswerMemberParams['content'];
}

interface UserSlashCommandError extends CommandErrorDefault {
    type: 'COMMAND_INTERACTION_USER' | 'DISCORD_API';
    slashCommandParams?: Parameters<ExecuteSlashCommand>;
    message: AnswerMemberParams['content'];
}

interface DiscordAPICommandError extends CommandErrorDefault {
    type: 'DISCORD_API' | 'UNKNOWN';
    message?: AnswerMemberParams['content'];
    slashCommandParams?: Parameters<ExecuteSlashCommand>;
    commandParams?: Parameters<ExecuteCommand>;
}

export type CommandErrorType = UserCommandError | UserSlashCommandError | DiscordAPICommandError;

interface ICommandError {
    throwError(): void;
}

class CommandError implements ICommandError {
    private readonly ERROR_TYPE: CommandErrorType['type'];
    private readonly message?: Message;
    private readonly interaction?: Interaction;
    private readonly answerMemberMessage?: AnswerMemberParams['content'];
    private readonly logError: CommandErrorDefault;

    constructor(commandError: CommandErrorType) {
        this.ERROR_TYPE = commandError.type;
        this.logError = {
            error: commandError.error,
            logMessage: commandError.logMessage,
            origin: commandError.origin
        }
        if ('commandParams' in commandError && commandError.commandParams) {
            const { commandParams, message } = commandError;
            this.message = commandParams[0];
            this.answerMemberMessage = message;
        } else if ('slashCommandParams' in commandError && commandError.slashCommandParams) {
            const { slashCommandParams, message } = commandError;
            this.interaction = slashCommandParams[0];
            this.answerMemberMessage = message;
        }
    }

    throwError(): void {
        (async () => {
            try {
                switch (this.ERROR_TYPE) {
                    case 'COMMAND_USER':
                        await this.throwCommandUserError();
                        break;

                    case 'COMMAND_INTERACTION_USER':
                        await this.throwCommandUserError();
                        break;

                    case 'DISCORD_API':
                        await this.throwCommandUserError();
                        this.throwLogicError();
                        break;

                    case 'UNKNOWN':
                        await this.throwLogicError();
                        break;
                }
            } catch (error) {
                console.error('[COMMAND_ERROR_HANDLER] src.commands.command.error.ts', error);
            }
        })();
    }

    private async throwCommandUserError() {
        if (this.interaction || this.message) {
            if (this.answerMemberMessage) {
                await AnswerMember({
                    message: this.message, interaction: this.interaction,
                    content: this.answerMemberMessage,
                    options: { editReply: true }
                });

            }
        }
    }

    private throwLogicError() {
        console.error('[COMMAND_ERROR_HANDLER]');
        this.logError.origin && console.error('--[ORIGIN]', this.logError.origin);
        this.logError.logMessage && console.error('--[LOG]', this.logError.logMessage);
        this.logError.error && console.error('--[ERROR]', this.logError.error);
    }
}

export default CommandError;