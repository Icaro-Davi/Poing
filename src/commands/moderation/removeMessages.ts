import { BotCommand } from "..";

const command: BotCommand = {
    name: 'remove-messages',
    category: '{category.moderation}',
    description: '{command.removeMessages.description}',
    aliases: ['rm'],
    usage: [
        [{
            required: true, arg: '{usage.quantity.arg}',
            description: '{usage.quantity.description}',
            example: '{command.removeMessages.usage.quantityExample}'
        }]
    ],
    allowedPermissions: ['MANAGE_MESSAGES'],
    exec: async (message, args, options) => {        
        if (message.channel.type == 'DM') return false;
        if (Number.isNaN(Number(args[0]))) return await message.channel.send(options.locale.interaction.mustBeNumber);

        const deletedMessages = await message.channel.bulkDelete(Number(args[0]), true);
        return await message.channel.send(options.locale.command.removeMessages.interaction.deletedMessages.replace('{deletedMessageSize}', deletedMessages.size.toString()));
    }
}

export default command;