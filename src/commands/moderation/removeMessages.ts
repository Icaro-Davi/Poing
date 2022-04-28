import { BotCommand } from "..";
import locale from '../../locale/example.locale.json';

const command: BotCommand = {
    name: 'remove-messages',
    category: locale.category.moderation,
    description: locale.command.removeMessages.description,
    aliases: ['rm'],
    usage: [
        [{
            required: true, arg: locale.usage.argument.quantity.arg,
            description: locale.usage.argument.quantity.description,
            example: locale.command.removeMessages.usage.quantityExample
        }]
    ],
    allowedPermissions: ['MANAGE_MESSAGES'],
    exec: async (message, args, options) => {
        if (message.channel.type == 'DM') return;
        if (Number.isNaN(Number(args[0]))) return await { content: options.locale.interaction.mustBeNumber };

        const deletedMessages = await message.channel.bulkDelete(Number(args[0]), true);
        return {
            content: options.locale.command.removeMessages.interaction.deletedMessages,
            vars: {
                deletedMessageSize: deletedMessages.size.toString()
            }
        };
    }
}

export default command;