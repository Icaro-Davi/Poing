import Member from '../../../application/Member';
import { createFilter } from '../../argument.utils';
import { middleware } from '../../command.middleware';

import type { BotArgumentFunc, ExecuteCommandOptions } from '../../index.types';

const argument: Record<'MEMBER' | 'MESSAGE', BotArgumentFunc> = {
    MEMBER: (options) => ({
        required: true,
        name: 'member',
        description: options.locale.usage.argument.member.description,
        filter: createFilter(options, async (message, args) => {
            if (!args[0]) return;
            const member = message.mentions.members?.first() ?? (await Member.find({ guild: message.guild!, member: args[0] }));
            if (!member) return;
            return member;
        })
    }),
    MESSAGE: (options) => ({
        required: true,
        name: 'message',
        description: options.locale.usage.argument.message.description,
        filter: createFilter(options, (message, args, locale) => {
            const _message = args.slice(1).join(' ');
            if (!_message) throw new Error(locale.interaction.needArguments);
            return _message;
        })
    })
}

export default argument;

const getArgs = (options: ExecuteCommandOptions) => ({
    MEMBER: argument.MEMBER(options),
    MESSAGE: argument.MESSAGE(options)
});

export const argMiddleware = middleware.createGetArgument(
    async function (message, args, options, next) {
        const arg = getArgs(options);
        const member = args.get(arg.MEMBER.name);
        const msg = args.get(arg.MESSAGE.name);
        options.context.data = { member, message: msg };
        next();
    },
    async function (interaction, options, next) {
        const arg = getArgs(options);
        const member = interaction.options.getUser(arg.MEMBER.name, arg.MEMBER.required);
        const message = interaction.options.getString(arg.MESSAGE.name, arg.MESSAGE.required);
        options.context.data = { member, message };
        next();
    }
);