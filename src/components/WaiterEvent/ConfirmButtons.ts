import { MessageActionRow, MessageButton, Message, CommandInteraction, InteractionReplyOptions, ReplyMessageOptions, User, MessageEditOptions } from "discord.js";
import { Locale } from "../../locale";
import { onlyMessageAuthorCanUse } from "../collectorFilters";

const ConfirmButtonComponent = (options: { componentId: string; locale: Locale }) => {
    const yes = `component-confirm-button-yes-${options.componentId ?? ''}`;
    const no = `component-confirm-button-no-${options.componentId ?? ''}`;
    const row = new MessageActionRow().addComponents(
        new MessageButton()
            .setLabel(options.locale.messageActionRow.confirmButtons.successLabel || 'YES')
            .setStyle('SUCCESS')
            .setCustomId(yes),
        new MessageButton()
            .setLabel(options.locale.messageActionRow.confirmButtons.dangerLabel || 'NO')
            .setStyle('DANGER')
            .setCustomId(no),
    );
    return { component: row, id: { yes, no } };
}

export type ConfirmComponentAnswerOptionsParams = {
    messageReply?: Message<boolean>;
}
type AnswerFuncCallback = (options: ConfirmComponentAnswerOptionsParams) => void;

class ConfirmComponent {
    private readonly locale: Locale;
    private user: User;
    private messageReply: Message<boolean> | undefined;
    private messageProps: ReplyMessageOptions | undefined;
    private interaction: CommandInteraction | undefined;
    private interactionProps: InteractionReplyOptions | undefined;
    private Button: { component: MessageActionRow, id: { yes: string; no: string; } };

    constructor(options: { locale: Locale; user: User, buttonId: string }) {
        this.locale = options.locale;
        this.user = options.user;
        this.Button = ConfirmButtonComponent({
            locale: this.locale,
            componentId: options.buttonId
        });
    }

    setMessage(options: { message?: Message<boolean>, messageProps: ReplyMessageOptions }): Omit<ConfirmComponent, 'setMessage'> {
        if (options.message) {
            this.messageProps = options.messageProps;
            this.messageReply = options.message;
            (async () => {
                this.messageReply = await options.message?.reply({
                    ...options.messageProps,
                    components: [this.Button.component, ...(options.messageProps.components ?? [])]
                });
            })();
        }
        return this as Omit<ConfirmComponent, 'setMessage'>;
    }

    setInteraction(options: { interaction?: CommandInteraction, interactionProps: InteractionReplyOptions }): Omit<ConfirmComponent, 'setInteraction'> {
        if (options.interaction) {
            this.interaction = options.interaction;
            this.interactionProps = options.interactionProps;
            this.interaction.reply({
                ...options.interactionProps,
                components: [this.Button.component, ...(options.interactionProps.components ?? [])],
            });
        }
        return this as Omit<ConfirmComponent, 'setInteraction'>;
    }

    async onCollect(options: {
        onAnswerYes: AnswerFuncCallback;
        onAnswerNo: AnswerFuncCallback;
    }) {
        const collector = onlyMessageAuthorCanUse((this.messageReply ?? this.interaction!), { ephemeral: true, author: this.user, locale: this.locale });
        const timeoutId = setTimeout(() => {
            this.removeButtonsFromMessage();
            collector.stop();
        }, 1000 * 60 * 1);

        collector.on('collect', async interaction => {
            try {
                const onPressButton = async () => {
                    clearTimeout(timeoutId);
                    await this.removeButtonsFromMessage();
                    await interaction.deferUpdate();
                    collector.stop();
                }
                if (!interaction.isButton() || collector.ended || interaction.replied) return;
                if (interaction.customId === this.Button.id.yes) {
                    await options.onAnswerYes({ messageReply: this.messageReply });
                    await onPressButton();
                } else if (interaction.customId === this.Button.id.no) {
                    await options.onAnswerNo({ messageReply: this.messageReply });
                    await onPressButton();
                }
            } catch (err: any) {
                console.error(`[COMPONENT_CONFIRM_BUTTONS] Discord error code ${err?.code} http status ${err.httpStatus}`);
            }
        });

    }

    private async removeButtonsFromMessage() {
        if (this.messageProps) {
            return await this.messageReply?.edit({ ...this.messageProps, components: [] } as MessageEditOptions);
        } else if (this.interactionProps) {
            return await this.interaction?.editReply({ ...this.interactionProps, components: [] });
        }
    }
}


export default ConfirmComponent;