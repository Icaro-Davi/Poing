import Member from "../../../application/Member";
import { createFilter } from "../../argument.utils";
import { middleware } from "../../command.middleware";
import { BotArgumentFunc } from "../../index.types";
import embedCommandArgument from '../../utils/embed/command.args';

const argument: Record<'MESSAGE' | 'MEMBER' | 'EMBED', BotArgumentFunc> = {
    MESSAGE: (options) => ({
        name: 'message',
        description: options.locale.command.warn.usage.args.messageToSubmit,
        required: options.required ?? false,
        filter: createFilter(options, (message, args) => {
            if (args[0] === 'message') {
                return args.slice(2).join(' ');
            }
        })
    }),
    EMBED: (options) => ({
        name: 'embed',
        description: options.locale.command.warn.usage.args.useFlagsToCreateMessageEmbed,
        required: options.required ?? false,
        filter: createFilter(options, async (message, args) => {
            if (args[0] === 'embed') {
                return (await embedCommandArgument.FLAGS(options).filter?.(message, args, options.locale))?.data;
            }
        })
    }),
    MEMBER: (options) => ({
        name: 'member',
        description: options.locale.command.warn.usage.args.memberThatWillReceiveWarning,
        required: options.required ?? false,
        filter: createFilter(options, async (message, args) => {
            if (!args[1]) return;
            const member = message.mentions.members?.first() ?? await Member.find({ guild: message.guild!, member: args[1] })
            return member;
        })
    }),

}

export default argument;

export const getArgs = function () {
    return middleware.createGetArgument(
        function (message, args, options, next) {
            const data = {
                message: args.get(argument.MESSAGE(options).name),
                embed: args.get(argument.EMBED(options).name),
                member: args.get(argument.MEMBER(options).name)
            }
            options.context.data = data;
            options.context.argument = {
                subCommand: data.message!! ? 'message' : 'embed',
                isMessage: data.message!!,
                isEmbed: data.embed!!
            }
            next();
        },
        function (interaction, options, next) {
            const subCommand = interaction.options.getSubcommand();
            const arg = {
                member: argument.MEMBER(options),
                message: argument.MESSAGE(options),
                embed: argument.EMBED(options)
            }
            const data = {
                member: interaction.guild?.members.cache.find(member => member.id === interaction.options.getUser(arg.member.name, arg.member.required)?.id),
                message: interaction.options.getString(arg.message.name, arg.message.required)
            }
            options.context.data = data;
            options.context.argument = {
                subCommand,
                userInput: { ...data, member: `<@${data.member?.id}>` },
                isMessage: subCommand === arg.message.name,
                isEmbed: subCommand === arg.embed.name
            };
            next();
        }
    )
}