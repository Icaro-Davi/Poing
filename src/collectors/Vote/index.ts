import { Interaction, InteractionCollector, MappedInteractionTypes, Message } from "discord.js";
import AnswerMember, { AnswerMemberParams } from "../../utils/AnswerMember";
import CreateComponentId from "../../utils/CreateComponentId";

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

    private createComponentInteraction?: (userInput: UserInputData, componentRef: VoteCollector['componentRef']) => AnswerMemberParams;
    private eventOnFinish?: (result: UserInputData) => void | Promise<AnswerMemberParams | undefined>;
    private eventOnError?: (error?: any) => void | Promise<void>;

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
        try {
            const answerMemberOptions = await this.createComponentInteraction(this.userInputData, this.componentRef);
            const replyMessage = await AnswerMember({
                ...this.answerMemberParams,
                ...answerMemberOptions
            });
            if (this.answerMemberParams.message && replyMessage) this.answerMemberParams.message = replyMessage;
            this.startListeningEventCollect();
            this.stopCollectorAndReturnVoteResult();
        } catch (error) {
            this.eventOnError?.(error);
        }
    }

    private startListeningEventCollect() {
        const onCollect = async (interaction: CollectorInteraction) => {
            try {
                if (!interaction.customId.includes(this.uniqueId)) return;
                let userId = interaction.member?.user.id;
                if (!userId) return;
                switch (interaction.customId) {
                    case this.componentRef.yesId:
                        if (this.userInputData.vote.yes.has(userId)) break;
                        if (this.userInputData.vote.no.has(userId)) this.userInputData.vote.no.delete(userId);
                        this.userInputData.vote.yes.add(userId);
                        await AnswerMember({
                            ...this.answerMemberParams,
                            ...await this.createComponentInteraction!(this.userInputData, this.componentRef)
                        });
                        interaction.deferUpdate();
                        break;
                    case this.componentRef.noId:
                        if (this.userInputData.vote.no.has(userId)) break;
                        if (this.userInputData.vote.yes.has(userId)) this.userInputData.vote.yes.delete(userId);
                        this.userInputData.vote.no.add(userId);
                        await AnswerMember({
                            ...this.answerMemberParams,
                            ...await this.createComponentInteraction!(this.userInputData, this.componentRef)
                        });
                        interaction.deferUpdate();
                        break;
                }
            } catch (error) {
                this.eventOnError?.(error);
            }
        }
        this.collector.on('collect', onCollect);
    }

    private stopCollectorAndReturnVoteResult() {
        this.collectorContext.timeoutRef && clearTimeout(this.collectorContext.timeoutRef);
        const timeoutCallback = async () => {
            try {
                this.collector.stop();
                this.collectorContext.isSubmit = true;
                const answerMessageOptions = await this.eventOnFinish?.(this.userInputData);
                if (answerMessageOptions) await AnswerMember({ ...this.answerMemberParams, ...answerMessageOptions });
            } catch (error) {
                if (this.eventOnError) this.eventOnError(error);
                else console.error('src.collector.vote stopCollectorAndReturnVoteResult', error);
            }
        }
        this.collectorContext.timeoutRef = setTimeout(timeoutCallback, this.collectorOptions.time);
    }

    public applyMutableComponent(event: typeof this.createComponentInteraction) {
        this.createComponentInteraction = event;
        return this;
    }

    public onError(event?: typeof this.eventOnError) {
        this.eventOnError = event;
        return this;
    }

    public async onFinish(event: NonNullable<typeof this.eventOnFinish>) {
        this.eventOnFinish = event;
        await this.startCollector();
    }
}

export default VoteCollector;