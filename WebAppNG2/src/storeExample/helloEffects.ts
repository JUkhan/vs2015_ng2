
import {Injectable} from '@angular/core';
import {Effect} from '../shared/store/effects';
import {Actions} from '../shared/store/actions';
import {ADD_HOUR, SUBTRACT_HOUR, ADD_INFO} from './houseWorked';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class HelloEffects
{
    constructor(private actions: Actions) { }
    @Effect() info$ = this.actions
        .whenAction(ADD_INFO)
        .switchMap(res => {
            return Observable.of({ type: ADD_HOUR })
        });
        
  
}
