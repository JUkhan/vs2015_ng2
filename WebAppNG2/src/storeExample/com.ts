
import {Component, OnInit}        from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Store} from '../Store';
import {ADD_HOUR, SUBTRACT_HOUR, ADD_INFO} from './houseWorked';

@Component({
    moduleId: module.id,
    selector: 'com',
    template: `           
              <div>
                {{count | async}}
                <button (click)="increment()">++</button>
                <button (click)="decrement()">--</button>
                <button (click)="info()"> info</button>
            </div> 
            <p>{{person | async | json}}</p>       
            `   
})
export class com  {
    count: Observable<any>;
    person: Observable<any>;
    constructor(private store: Store) {
        this.count = store.select('houseWorked');
        this.person = store.select('person');
    }
    increment() {
        this.store.dispatch({ type: ADD_HOUR });
    }
    decrement() {
        this.store.dispatch({ type: SUBTRACT_HOUR });
    }
    info() {
        this.store.dispatch({ type: ADD_INFO, payload:{name:'adbulla', address:'earth'} });
    }
}