import { BotCommand } from "..";
import MD from "../../utils/md";
import { createGetHelp } from "../../utils/messageEmbed";

// https://www.youtube.com/watch?v=Emq30Kxaps4&ab_channel=dbr
const command: BotCommand = {
    name: 'remove-messages',
    category: 'Administration',
    description: 'Remove messages from any channel, discord limit bots to remove messages until 2 weeks ago.',
    aliases: ['rm'],
    usage: [
        [{ required: true, arg: 'quantity', description: 'Quantity of messages to remove', example: `${MD.codeBlock.line('{prefix}rm 5')} - Will remove 5 last messages.` }]
    ],
    allowedPermissions: ['MANAGE_MESSAGES'],
    getHelp: (customPrefix) => createGetHelp(command, customPrefix),
    exec: async (message, args) => {
        if (message.channel.type == 'DM') return false;
        if (!Number.isNaN(Number(args[0]))) {
            const deletedMessages = await message.channel.bulkDelete(Number(args[0]), true);
            return message.channel.send(`Deleted ${deletedMessages.size} messages`);
        }
    }
}

export default command;