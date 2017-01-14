import {Observable, Subject, Subscription} from 'rxjs/Rx';
export const adapter = {
    makeSubject<T>() {
        const stream = new Subject<T>();
        const observer = {
            next(x: T) { stream.next(x); },
            error(x: any) { stream.error(x); },
            complete() { stream.complete(); }
        }
        return { stream, observer };
    },
    streamSubscribe<T>(stream: Observable<T>, observer) {
        const subscription = stream.subscribe(observer);
        return () => {
            subscription.unsubscribe();
        }
    },
    adapt<T>(originalStream: any, originalStreamSubscribe): Observable<T> {
        if (this.isValidStream(originalStream)) {
            return originalStream;
        }
        console.log('adapt() crete new stream');
        return Observable.create(function (observer) {
            console.log('adapt->Observable.create');
            const dispose = originalStreamSubscribe(originalStream, observer);
            return () => {
                if (typeof dispose === 'function') {
                    dispose();
                }
            }
        });
    },
    isValidStream(stream: any): boolean {
        return typeof stream.subscribe === 'function';
    },
    remember<T>(stream: Observable<T>) {
        stream.share();        
    }

};