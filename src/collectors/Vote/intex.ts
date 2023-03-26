import { Interaction, InteractionCollector, MappedInteractionTypes, Message } from "discord.js";
import AnswerMember from "../../utils/AnswerMember";
import CreateComponentId from "../../utils/CreateComponentId";
import MD from "../../utils/md";

type VoteComponentParams = {
    interaction?: Interaction;
    message?: Message;
    vote: { endsInMilliseconds: number; };
}

type VoteCollectorContext = {
    time: number;
}

type UserInputData = {
    vote: {
        yes: Set<string>;
        no: Set<string>;
    }
}

type CollectorInteraction = MappedInteractionTypes[keyof MappedInteractionTypes];

class VoteCollector {

    private readonly uniqueId: string;
    private readonly answerMemberParams: { message?: Message; interaction?: Interaction; options: { editReply: boolean } } = { options: { editReply: true } };
    private readonly userInputData: UserInputData = { vote: { yes: new Set<string>(), no: new Set<string>() } };
    private readonly componentRef: { yesId: string; noId: string; };

    private readonly collector: InteractionCollector<CollectorInteraction>;
    private readonly collectorOptions: VoteCollectorContext = { time: 0 };
    private readonly collectorContext: { timeoutRef?: NodeJS.Timeout; isSubmit: boolean; } = { isSubmit: false };

    private createComponentInteraction?: (userInput: UserInputData, componentRef: VoteCollector['componentRef']) => void | Promise<void>;
    private eventOnFinish?: (result: UserInputData) => void | Promise<void>;

    constructor(private readonly params: VoteComponentParams) {
        if (!params.interaction && !params.message) throw new Error('Need Interaction or Message as argument');
        let author = (params.interaction?.user ?? params.message?.member?.user)!;

        this.answerMemberParams.interaction = params.interaction; this.answerMemberParams.message = params.message;
        this.uniqueId = `${Math.random().toString(32).slice(4)}-${author.id}`;
        this.componentRef = {
            yesId: this.createId('yes'),
            noId: this.createId('no')
        }

        this.collectorOptions.time = params.vote.endsInMilliseconds;
        this.collector = (params.message?.channel.createMessageComponentCollector(this.collectorOptions) ?? params.interaction?.channel?.createMessageComponentCollector(this.collectorOptions))!;
    }

    private createId(componentId: string) {
        return CreateComponentId('vote', `${componentId}-${this.uniqueId}`);
    }

    private async startCollector() {
        if (!this.createComponentInteraction) throw new Error('Needs register a component to change on user interact');
        this.stopCollectorAndReturnVoteResult();
        await this.createComponentInteraction(this.userInputData, this.componentRef);
        this.startListeningEventCollect();
    }

    private startListeningEventCollect() {
        const onCollect = async function (this: VoteCollector, interaction: CollectorInteraction) {
            if (!interaction.customId.includes(this.uniqueId)) return;
            let userId = interaction.member?.user.id;
            if (!userId) return;
            switch (interaction.customId) {
                case this.componentRef.yesId:
                    if (this.userInputData.vote.yes.has(userId)) break;
                    if (this.userInputData.vote.no.has(userId)) this.userInputData.vote.no.delete(userId);
                    this.userInputData.vote.yes.add(userId);
                    await this.createComponentInteraction?.(this.userInputData, this.componentRef);
                    interaction.deferUpdate();
                    break;
                case this.componentRef.noId:
                    if (this.userInputData.vote.no.has(userId)) break;
                    if (this.userInputData.vote.yes.has(userId)) this.userInputData.vote.yes.delete(userId);
                    this.userInputData.vote.no.add(userId);
                    await this.createComponentInteraction?.(this.userInputData, this.componentRef);
                    interaction.deferUpdate();
                    break;
            }
        }
        this.collector.on('collect', onCollect.bind(this));
    }

    private stopCollectorAndReturnVoteResult() {
        this.collectorContext.timeoutRef && clearTimeout(this.collectorContext.timeoutRef);
        const timeoutCallback = async function (this: VoteCollector) {
            this.collector.stop();
            this.collectorContext.isSubmit = true;
            let answerMessage = MD.codeBlock.multiline(`Resultado:\n${this.userInputData.vote.yes.size} voto(s) em sim\n${this.userInputData.vote.no.size} voto(s) em não`);
            await AnswerMember({ ...this.answerMemberParams, content: { content: answerMessage } });
            this.eventOnFinish?.(this.userInputData);
        }
        this.collectorContext.timeoutRef = setTimeout(timeoutCallback.bind(this), this.collectorOptions.time);
    }

    public applyMutableComponent(event: typeof this.createComponentInteraction) {
        this.createComponentInteraction = event;
        return this;
    }

    public onFinish(event: NonNullable<typeof this.eventOnFinish>) {
        this.eventOnFinish = event;
        this.startCollector();
    }
}

export default VoteCollector;