import {Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface Action
{
    type: string;
    payload?: any;
}

@Injectable()
export class Dispatcher extends BehaviorSubject<Action> {
    static INIT = 'INIT_STORE';

    constructor()
    {
        super({ type: Dispatcher.INIT });
    }

    dispatch(action: Action): void
    {
        this.next(action);
    }

    complete()
    {
        // noop
    }
}