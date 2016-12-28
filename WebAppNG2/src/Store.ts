import {Injectable} from '@angular/core';
import {Subject, BehaviorSubject} from 'rxjs/Rx';

@Injectable()
export class Store extends BehaviorSubject<any> {
    private dispatcher = new Subject();
    constructor(private reducer, initialState = {}) {
        super(initialState);
        this.dispatcher            
            .scan((state, action) => this.reducer(state, action), initialState)
            .subscribe(state => super.next(state));
        console.log('Store init');
    }
    dispatch(action: { type: string,payload?:any }) {
        this.dispatcher.next(action);
    }

    select(name: string) {
        return this.map((state: any) => state[name]).distinctUntilChanged();
    }
    error(err: any) {
        this.dispatcher.error(err);
    }
}

const combineReducers = reducers => (state = {}, action) => {
    return Object.keys(reducers).reduce((nextState, key) => {
        nextState[key] = reducers[key](state[key], action);
        return nextState;
    }, {});
};

export const storeFactory = function (reducers) {
    return { provide: Store, useFactory: () => new Store(combineReducers(reducers), {}) };
}