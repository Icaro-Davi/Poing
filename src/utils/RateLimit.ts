class RateLimit<R = any>{
    private readonly time: number;
    private readonly rateLimit: number = 0;
    private readonly queue: (() => Promise<R>)[] = [];
    private readonly data: PromiseSettledResult<R>[] = [];
    private timeoutReference: NodeJS.Timeout | null = null;

    constructor(private readonly params: { limit: number, interval: number; }) {
        this.time = params.interval;
        this.rateLimit = params.limit;
    }

    public schedule(callback: () => Promise<R>) {
        this.queue.push(callback);
        return this;
    }

    private async runScheduleTask() {
        const sliceSize = Math.min(this.rateLimit, this.queue.length);
        const data = await Promise.allSettled([
            ...this.queue.splice(0, sliceSize).map(cb => cb())
        ]);
        data.forEach(d => this.data.push(d));
    }

    private awaiterAllScheduledComplete() {
        return new Promise(async (resolve, reject) => {
            await this.runScheduleTask();
            const awaitableSchedules = () => {
                if (this.queue.length) this.timeoutReference = setTimeout(async () => {
                    await this.runScheduleTask();
                    awaitableSchedules();
                }, this.time);
                else {
                    this.timeoutReference && clearTimeout(this.timeoutReference);
                    this.timeoutReference = null;
                    resolve(true);
                }
            }
            awaitableSchedules();
        });
    }

    public async exec() {
        await this.awaiterAllScheduledComplete();
        return this.data;
    }
}

export default RateLimit;