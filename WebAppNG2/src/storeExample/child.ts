import {makeDomDriver, run, h, div, span, h1, button} from '../Cycle';
import {Component, OnInit, Input, ChangeDetectionStrategy, AfterViewInit, ViewChild, ElementRef}        from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Store} from '../shared/store/Store';
import {ADD_HOUR, SUBTRACT_HOUR, ADD_INFO} from './houseWorked';

@Component({
    moduleId: module.id,
    selector: 'child',
    template: `           
             <div>
                 name: {{person?.name}}  address: {{person?.address}}  count:{{person?.count}}
            </div> 
             <div #app></div>      
            `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class child implements AfterViewInit {

    @Input() person: any;
    constructor() {

    }
    @ViewChild('app') container: ElementRef;
    ngAfterViewInit() {
        run(this.appLogic, { dom: makeDomDriver(this.container.nativeElement)});
    }
    appLogic(sources) {
        const dec$ = sources.dom.select('.dec', 'click').map(ev => -1);
       
        const inc$ = sources.dom.select('.inc').map(ev => +1);
        const number$ = Observable.of(10).merge(dec$, inc$).scan((pre, cur) => pre + cur);
        //total$.subscribe(res => console.log('click', res))
        const sinks = {
            dom: number$
                .map(it => {
                    return div([
                        button('.dec', ['Decrement']),
                        button('.inc', ['Increment']),
                        span([` Total : ${it}`])
                    ]);
                })

        }
        return sinks;
    }
}