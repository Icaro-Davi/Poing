import { BotCommand } from "..";
import { Member } from "../../application";
import getValuesFromStringFlag from "../../utils/regex/getValuesFromStringFlag";
import { replaceVarsInString } from "../../locale";
import { confirmButtons } from "../../components/messageActionRow";
import { confirm, PM } from "../../components/messageEmbed";
import handleError from "../../utils/handleError";

const command: BotCommand = {
    name: 'ban',
    category: '{category.moderation}',
    description: '{command.ban.description}',
    allowedPermissions: ['BAN_MEMBERS'],
    usage: [
        [{
            required: true, arg: '{usage.member.arg}',
            description: '{usage.member.description}',
            example: '{command.ban.usage.memberExample}'
        }],
        [{
            required: false, arg: '-days',
            description: '{usage.-daysBan.description}',
            example: '{command.ban.usage.-daysExample}'
        }],
        [{
            required: false, arg: '-reason',
            description: '{usage.-reason.description}',
            example: '{command.ban.usage.-reasonExample}'
        }]
    ],
    exec: async (message, args, options) => {
        const member = await Member.search(message, args[0]);
        if (!member) return await message.channel.send(options.locale.interaction.memberNotFound);
        if (!member.bannable) return await message.channel.send(options.locale.interaction.memberIsNotBannable);
        
        const days = getValuesFromStringFlag(args, ['-days', '--d']);
        const reason = getValuesFromStringFlag(args, ['-reason', '--r']);

        if (days) {
            if (Number.isNaN(days)) return await message.channel.send(`[-days | --d] - ${options.locale.interaction.mustBeNumber}`);
            else if (Number(days) > 7 || Number(days) < 0) return await message.channel.send(replaceVarsInString(`[-days | --d] - ${options.locale.interaction.numberMustBeBetweenTwoValues}`, { number1: 0, number2: 7 }));
        }

        const component = confirmButtons({ locale: options.locale });

        const interactionMessage = await message.channel.send({
            embeds: [confirm.banMember({
                locale: options.locale, botColor: options.bot.hexColor,
                authorTag: message.author.tag, authorUrl: message.author.avatarURL() || '',
                days: Number(days), reason, member
            })],
            components: [component.row]
        });

        const collector = message.channel.createMessageComponentCollector({
            filter: async (interaction) => {
                if (interaction.user.id === message.author.id) return true;
                await interaction.reply({ ephemeral: true, content: options.locale.interaction.youCantUseThisButton });
                return false;
            },
            max: 1,
            time: 1000 * 60
        });

        collector.on('end', async (buttonInteraction) => {
            try {
                let buttonId = buttonInteraction.first()?.customId;
                if (buttonId === component.button.yesId) {
                    let promises = [];
                    promises.push(member.ban({ days: Number(days), reason }));
                    promises.push(buttonInteraction.first()?.reply(options.locale.interaction.memberBanishedFromServer));
                    await Promise.all(promises);
                    member.send({
                        embeds: [PM.toBanishedMember({
                            botColor: options.bot.hexColor, locale: options.locale,
                            guildName: message.guild?.name || '', iconUrl: message.guild?.iconURL() || '',
                            reason
                        })],
                    }).catch((error) => {
                        handleError(error, {
                            errorLocale: '/command/moderation/ban',
                            locale: options.locale,
                            message: message,
                            customMessage: error.code === '50007' ? options.locale.command.ban.error[50007] : '' 
                        });
                    });
                    await interactionMessage.edit({ content: '🔨', embeds: [] });
                }
                if (buttonId === component.button.noId) {
                    await interactionMessage.edit({ content: '🎈', embeds: [], components: [] });
                    await buttonInteraction.first()?.reply(options.locale.interaction.memberBanishedCanceled);
                }
                return;
            } catch (error: any) {
                handleError(error, {
                    errorLocale: '/command/moderation/ban',
                    locale: options.locale,
                    message: message
                });
            }
        });
    }
}

export default command;