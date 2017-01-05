import {Injectable, OpaqueToken, NgModule, ModuleWithProviders, OnDestroy, Inject } from '@angular/core';
import {Subject, BehaviorSubject, Observer} from 'rxjs/Rx';
import { Dispatcher, Action } from './dispatcher';

export const _INITIAL_REDUCER = new OpaqueToken('Token _ngrx/store/reducer');

@Injectable()
export class Store extends BehaviorSubject<any> implements OnDestroy{
    //private dispatcher = new Subject();
    constructor(
        @Inject(_INITIAL_REDUCER) private reducer,
        @Inject(Dispatcher) private dispatcher: BehaviorSubject<Action>
       ) {
        super({});
       
        this.dispatcher            
            .scan((state, action) => this.reducer(state, action), {})
            .subscribe(state => super.next(state));
        console.log('Store init');
    }
    dispatch(action: Action)
    {
        this.dispatcher.next(action);
    }
    next(action: Action) {
        this.dispatcher.next(action);
    }
    select(name: string) {
        return this.map((state: any) => state[name]).distinctUntilChanged();
    }
    error(err: any) {
        this.dispatcher.error(err);
    }
    ngOnDestroy()
    {
        console.log('Store destroy..............');
    }
}

export const combineReducers = reducers => (state = {}, action) => {
    return Object.keys(reducers).reduce((nextState, key) => {
        nextState[key] = reducers[key](state[key], action);
        return nextState;
    }, {});
};

//export function _storeFactory(reducer, dispatcher)
//{
//    return new Store(reducer, dispatcher,  {});
//} 


//export function provideStore(reducers: any,  _initialState?: any): any[]
//{
//    return [
//        Dispatcher,
//        { provide: _INITIAL_REDUCER, useValue: combineReducers(reducers) },
//        { provide: Store, useFactory: _storeFactory, deps: [_INITIAL_REDUCER, Dispatcher] }
//    ];
//}

//@NgModule({   
//})
//export class StoreModule
//{
//    static provideStore(_reducer: any, _initialState?: any): ModuleWithProviders
//    {
//        return {
//            ngModule: StoreModule,
//            providers: provideStore(_reducer, _initialState)
//        };
//    }
//}

//export const storeFactory = function ()
//{
//    return { provide: Store, useFactory: _storeFactory, deps: [_INITIAL_REDUCER, Dispatcher] }
//}


