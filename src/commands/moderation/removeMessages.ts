import { BotCommand } from "..";
import MD from "../../utils/md";

const command: BotCommand = {
    name: 'remove-messages',
    category: 'Moderation',
    description: 'Remove messages from any channel, discord limit bots to remove messages until 2 weeks ago.',
    aliases: ['rm'],
    usage: [
        [{ required: true, arg: 'quantity', description: 'Quantity of messages to remove', example: `${MD.codeBlock.line('{prefix}rm 5')} - Will remove 5 last messages.` }]
    ],
    allowedPermissions: ['MANAGE_MESSAGES'],
    exec: async (message, args) => {
        if (message.channel.type == 'DM') return false;
        if (!Number.isNaN(Number(args[0]))) {
            const deletedMessages = await message.channel.bulkDelete(Number(args[0]), true);
            return message.channel.send(`Deleted ${deletedMessages.size} messages`);
        }
    }
}

export default command;