
import {Component, OnInit, ChangeDetectionStrategy}        from '@angular/core';
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
            <child [person]="person | async"></child>      
            `,
            changeDetection:ChangeDetectionStrategy.OnPush   
})
export class com  {
    count: Observable<any>;
    person: Observable<any>;
    constructor(private store: Store) {
        this.count = store.select('houseWorked');
        this.person = this.count.combineLatest(store.select('person'), (count:any, person)=>{
                               return Object.assign({}, person,{count} );
                            });
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