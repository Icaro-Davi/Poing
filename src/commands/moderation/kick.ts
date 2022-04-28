import { BotCommand } from "..";
import { MemberApplication } from "../../application";
import { confirmButtons } from "../../components/messageActionRow";
import { confirm, PM } from "../../components/messageEmbed";
import { onlyMessageAuthorCanUse } from "../../utils/collectorFilters";
import handleError from "../../utils/handleError";
import locale from '../../locale/example.locale.json';

const command: BotCommand = {
    name: 'kick',
    category: locale.category.moderation,
    description: locale.command.kick.description,
    allowedPermissions: ['KICK_MEMBERS'],
    usage: [
        [{
            required: true, arg: locale.usage.argument.member.arg,
            description: locale.usage.argument.member.description,
            example: locale.command.kick.usage.memberExample
        }],
        [{
            required: false, arg: locale.usage.argument.reason.arg,
            description: locale.usage.argument.reason.description,
            example: locale.command.kick.usage.reasonExample
        }]
    ],
    exec: async (message, args, options) => {
        const member = await MemberApplication.search(message, args[0]);
        if (!member) return { content: options.locale.interaction.member.notFound };
        if (!member.kickable) return { content: options.locale.interaction.member.isNotKickable };

        const reason = args.slice(1).join(' ');
        const component = confirmButtons({ locale: options.locale });

        const interactionMessage = await message.channel.send({
            embeds: [confirm.kickMember({
                botColor: options.bot.hexColor,
                locale: options.locale, authorTag: message.author.tag, authorUrl: message.author.avatarURL() || '',
                member, reason
            })],
            components: [component.row]
        });

        const collector = onlyMessageAuthorCanUse(message, options.locale);

        collector.on('end', async memberInteraction => {
            try {
                const componentId = memberInteraction.first()?.customId;
                if (componentId === component.button.yesId) {
                    await member.kick(reason || '');
                    await memberInteraction.first()?.reply(options.locale.interaction.member.kickFromServer);
                    member.send({
                        embeds: [PM.toKickedMember({
                            botColor: options.bot.hexColor, guildName: message.guild?.name || '',
                            iconUrl: message.guild?.iconURL() || '',
                            locale: options.locale,
                            reason
                        })]
                    }).catch(error => handleError(error, {
                        errorLocale: '/commands/moderation/kick',
                        locale: options.locale,
                        message,
                        customMessage: error.code == '50007' ? options.locale.command.kick.error[50007] : ''
                    }));
                    await interactionMessage.edit({ content: '🦶💢', components: [] });
                    return;
                }
                if (componentId === component.button.noId) {
                    await interactionMessage.edit({ content: '🎈', embeds: [], components: [] });
                    await message.channel.send(options.locale.interaction.member.kickCanceled);
                    return;
                }
            } catch (error) {
                handleError(error, {
                    locale: options.locale,
                    errorLocale: '/commands/moderation/kick',
                    message,
                });
            }
        });
    }
};

export default command;