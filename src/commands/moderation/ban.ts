import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { BotCommand } from "..";
import { Member } from "../../application";
import getValuesFromStringFlag from "../../utils/regex/getValuesFromStringFlag";
import MD from "../../utils/md";

const command: BotCommand = {
    name: 'ban',
    category: 'Moderation',
    description: 'Ban any member from the server',
    allowedPermissions: ['BAN_MEMBERS'],
    usage: [
        [{
            required: true, arg: 'member',
            description: `The reference of any server member, can be ${MD.codeBlock.line('[mention | memberId]')}.`,
            example: `${MD.codeBlock.line(`{prefix}ban @${process.env.BOT_NAME}`)} - Now @${process.env.BOT_NAME} is banned from the server.`
        }],
        [{
            required: false, arg: '-days',
            description: `Number of days of messages to delete, can be a number between 0-7 ${MD.bold.b('(default 0)')}, you can refere this argument with ${MD.codeBlock.line('[-days "number" | --d "number"]')}.`,
            example: `${MD.codeBlock.line(`{prefix}ban @${process.env.BOT_NAME} -days "1"`)} - Will ban @${process.env.BOT_NAME} and delete messages messages from 1 day.`
        }],
        [{
            required: false, arg: '-reason',
            description: `Reason for ban the member from the server. you can refere this argument with ${MD.codeBlock.line('[-reason "message" | --r "message"]')}.`,
            example: `${MD.codeBlock.line('{prefix}ban @Poing -reason "The member Poing is jumping through the server".')} - It will ban @Poing with a reason.`
        }]
    ],
    exec: async (message, args) => {
        const days = Number(getValuesFromStringFlag(args, ['-days', '--d']));
        const reason = getValuesFromStringFlag(args, ['-reason', '--r']);

        if (Number.isNaN(days)) return await message.channel.send('flag [-days | --d] must be a number');
        else if (days > 7 || days < 0) return await message.channel.send('Days must be between 0 and 7 days');

        const member = await Member.search(message, args[0]);
        if (!member) return await message.channel.send('I can not find this member');
        if (!member.bannable) return await message.channel.send('This member is so powerful that I cannot banish him.');

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel('YES')
                .setStyle('SUCCESS')
                .setCustomId('yes'),
            new MessageButton()
                .setLabel('NO')
                .setStyle('DANGER')
                .setCustomId('no')
        );

        await message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(`#${process.env.BOT_MESSAGE_EMBED_HEX_COLOR}`)
                    .setAuthor({ name: message.author.tag, iconURL: message.author?.avatarURL() || '' })
                    .setTitle(MD.bold.b('Please confirm your ban!'))
                    .setFields([
                        { name: 'Tag', value: member.user.tag },
                        { name: 'Days', value: `Deleting messages from ${MD.codeBlock.line(`${days || 0} days`)}` },
                        ...reason ? [{ name: 'Reason for ban', value: reason }] : []
                    ])
                    .setThumbnail(member.user?.avatarURL() || '')
            ],
            components: [row]
        });

        const collector = message.channel.createMessageComponentCollector({
            filter: async (interaction) => {
                if (interaction.user.id === message.author.id) return true;
                await interaction.reply({ ephemeral: true, content: 'This button has a spell that prevents you from using!' });
                return false;
            },
            max: 1,
            time: 30000
        });

        collector.on('end', async (buttonInteraction) => {
            let buttonId = buttonInteraction.first()?.customId;
            if (buttonId === 'yes') {
                let promises = [];
                promises.push(member.ban({ days: Number(days), reason }))
                promises.push(buttonInteraction.first()?.reply('You banish him!'))
                promises.push(member.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(`#${process.env.BOT_MESSAGE_EMBED_HEX_COLOR}`)
                            .setAuthor({ name: message.guild?.name || '', iconURL: message.guild?.iconURL() || '' })
                            .setTitle('You are banished!')
                            .setFields([{ name: 'Reason', value: reason || 'No reason' }])
                    ]
                }));
                await Promise.all(promises);
            }
            if (buttonId === 'no')
                await buttonInteraction.first()?.reply('You canceled, he are free now!');
            return;
        });

    }
}

export default command;