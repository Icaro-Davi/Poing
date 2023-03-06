type PromiseFunc<T> = (promiseId: string) => Promise<T>;
type OnResolveCb<T> = (data: T) => Promise<void> | void;

const STATUS = {
    CANCELED: 'PROMISE_CANCELLED'
}

class CancelablePromise<T = any> {
    private reject?: (reason?: any) => void;
    private onResolveCb?: OnResolveCb<T>;
    private onRejectCb?: (err: any) => void;

    public promiseId = Math.random().toString(32).slice(4);

    constructor(promiseFunc: PromiseFunc<T>) {
        new Promise<T>((resolve, reject) => {
            this.reject = reject;
            promiseFunc(this.promiseId).then(resolve).catch(reject);
        })
            .then(data => {
                this.onResolveCb?.(data)
                    ?.catch(err => this.onRejectCb?.(err));
            })
            .catch(err => {
                if (err === STATUS.CANCELED) return;
                this.onRejectCb?.(err);
            });
    }

    onResolve(callback: OnResolveCb<T>) {
        this.onResolveCb = callback;
    }

    onReject(callback: (err: any) => void) {
        this.onRejectCb = callback;
    }

    cancel() {
        if (this.reject) {
            this.reject(STATUS.CANCELED);
        }
    }
}

export default CancelablePromise;