import { getFlagsFromUserInput } from "../../../utils/regex/getValuesFromStringFlag";
import { createFilter } from "../../argument.utils";
import { middleware } from "../../command.middleware";
import { BotArgumentFunc } from "../../index.types";

const argument: Record<'FLAGS', BotArgumentFunc> = {
    FLAGS: options => ({
        name: 'flags',
        description: options.locale.command.embed.usage.flag.description,
        required: options.required ?? false,
        filter: createFilter(options, (message, args) => {
            const flags = getFlagsFromUserInput(message.content, {
                title: {
                    type: 'STRING',
                    flags: ['--title', '-t']
                },
                description: {
                    type: 'STRING',
                    flags: ['--desc', '-d']
                },
                footer: {
                    type: 'STRING',
                    flags: ['--footer', '-f']
                },
                thumbnail: {
                    type: 'STRING',
                    flags: ['--thumb', '-tb']
                },
                fieldTitle: {
                    type: 'ARRAY',
                    flags: ['--field_title', '-ft']
                },
                fieldValue: {
                    type: 'ARRAY',
                    flags: ['--field_value', '-fv']
                },
                fieldTitleInline: {
                    type: 'ARRAY',
                    flags: ['--field_title_inline', '-fti']
                },
                fieldValueInline: {
                    type: 'ARRAY',
                    flags: ['--field_value_inline', '-fvi']
                }
            });
            return flags;
        })
    })
}

export default argument;

export const argsMiddleware = middleware.createGetArgument(
    async function (message, args, options, next) {
        const flags = args.get(argument.FLAGS(options).name);
        options.context.data.flags = flags;
        next();
    },
    () => { }
)