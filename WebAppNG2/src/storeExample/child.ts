import {makeDomDriver, run, h} from '../cycle/core';
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

    runDispose:any

    @Input() person: any;
    constructor() {

    }
    @ViewChild('app') container: ElementRef;
    ngAfterViewInit() {
        this.runDispose = run(
            this.appLogic,
            { dom: makeDomDriver(this.container.nativeElement) }
        );
    }
    ngOnDestroy() {
        this.runDispose();
        console.log('run disposed');
    }
    appLogic(sources) {
        const dec$ = sources.dom.selectEvents('.dec', 'click').map(ev => -1);       
        const inc$ = sources.dom.selectEvents('.inc', 'click').map(ev => +1);
        const refresh$ = sources.dom.selectEvents('.refresh', 'click').map(ev => 3);

        const number$ = refresh$.startWith(0).flatMap(_ => Observable.of(0).merge(dec$, inc$).scan((pre, cur) => pre + cur));
       
        const sinks = {
            dom: number$
                .map(it => {
                    return h('div',[
                        h('button.dec', ['Decrement']),
                        h('button.inc', ['Increment']),
                        h('button.refresh', ['Refresh']),
                        h('b', { style: { color: it>15? 'red':'blue' } }, [` Total : ${it}`])
                    ]);
                })

        }
        return sinks;
    }
}