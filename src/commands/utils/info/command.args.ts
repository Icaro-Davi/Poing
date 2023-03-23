import Member from "../../../application/Member";
import { createFilter } from "../../argument.utils";
import { middleware } from "../../command.middleware";

import type { BotArgumentFunc } from "../../index.types";

const argument: Record<'MEMBER' | 'TARGET_MEMBER', BotArgumentFunc> = {
    MEMBER: (options) => ({
        name: 'member',
        description: options.locale.usage.argument.member.description,
        required: false,
        filter: createFilter(options, async function (message, args) {
            if (!args[1]) return;
            if (args[0] && args[0] === argument.MEMBER(options).name) {
                const member = message.mentions.members?.first() ?? await Member.find({ guild: message.guild!, member: args[1] });
                return member;
            }
        })
    }),
    TARGET_MEMBER: (options) => ({
        name: 'target',
        description: options.locale.usage.argument.member.description,
        required: true,
    })
}

export default argument;

export const argsMiddleware = middleware.createGetArgument(
    async function (message, args, options, next) {
        const member = args.get(argument.MEMBER(options).name);
        if (member) {
            options.context.data = { member };
            options.context.argument = { subCommand: 'member' };
        }
        next();
    },
    async function (interaction, options, next) {
        const args = { member: argument.MEMBER(options), targetMember: argument.TARGET_MEMBER(options) };
        const subCommand = interaction.options.getSubcommand();
        if (subCommand.includes(args.member.name)) {
            const member = interaction.options.getMember(args.targetMember.name);
            if (!member)
                return next({
                    type: 'COMMAND_INTERACTION_USER',
                    message: { content: options.locale.interaction.member.notFound, ephemeral: true }
                });
            options.context.data = { member };
            options.context.argument = { subCommand };
        }
        next();
    }
)