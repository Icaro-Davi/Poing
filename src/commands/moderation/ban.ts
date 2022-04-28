import { BotCommand } from "..";
import { MemberApplication } from "../../application";
import getValuesFromStringFlag from "../../utils/regex/getValuesFromStringFlag";
import { confirmButtons } from "../../components/messageActionRow";
import { confirm, PM } from "../../components/messageEmbed";
import handleError from "../../utils/handleError";
import { onlyMessageAuthorCanUse } from "../../utils/collectorFilters";
import locale from '../../locale/example.locale.json';

const command: BotCommand = {
    name: 'ban',
    category: locale.category.moderation,
    description: locale.command.ban.description,
    allowedPermissions: ['BAN_MEMBERS'],
    usage: [
        [{
            required: true, arg: locale.usage.argument.member.arg,
            description: locale.usage.argument.member.description,
            example: locale.command.ban.usage.memberExample
        }],
        [{
            required: false, arg: '-days',
            description: locale.usage.flag['-daysBan'].description,
            example: locale.command.ban.usage['-daysExample']
        }],
        [{
            required: false, arg: '-reason',
            description: locale.usage.flag['-reason'].description,
            example: locale.command.ban.usage['-reasonExample']
        }]
    ],
    exec: async (message, args, options) => {
        const member = await MemberApplication.search(message, args[0]);
        if (!member) return { content: options.locale.interaction.member.notFound };
        if (!member.bannable) return { content: options.locale.command.ban.interaction.isNotBannable };

        const days = getValuesFromStringFlag(args, ['-days', '--d']);
        const reason = getValuesFromStringFlag(args, ['-reason', '--r']);

        if (days) {
            if (Number.isNaN(days))
                return { content: options.locale.interaction.mustBeNumber, vars: { flagDays: '`[-days | --d]` - ' } };
            else if (Number(days) > 7 || Number(days) < 0)
                return { content: options.locale.interaction.numberMustBeBetweenTwoValues, vars: { number1: '0', number2: '7', flagDays: '`[-days | --d]` - ' } };
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

        const collector = onlyMessageAuthorCanUse(message, options.locale);

        collector.on('end', async (buttonInteraction) => {
            try {
                let buttonId = buttonInteraction.first()?.customId;
                if (buttonId === component.button.yesId) {
                    let promises = [];
                    promises.push(member.ban({ days: Number(days), reason }));
                    promises.push(buttonInteraction.first()?.reply(options.locale.command.ban.interaction.banishedFromServer));
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
                    await buttonInteraction.first()?.reply(options.locale.command.ban.interaction.banishedCanceled);
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