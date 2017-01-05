import {Observable, Subject, Subscription} from 'rxjs/Rx';

export const main = function () {
    const effects = {
        DOM: DOMDriver,
        LOG: LOGDriver
    };
    run(logic, effects);

};
function logic(sources) {
    const click$ = sources.DOM;
    const sinks = {
        DOM: click$
            .startWith(null)
            .switchMap(() => Observable.timer(0, 1000).map(_ => {
                return {
                    tagName: 'H1',
                    children: [
                        {
                            tagName: 'SPAN', children:[ `Second ellapsed ${_}`]
                        }
                    ]
                }
            }))

        ,
        LOG: Observable.timer(0, 1000).take(3).map(_ => _ * 2)
            .map(_ => `Times ${_}`)
    }
    return sinks;

}

function createElement(obj) {
    
    const element: HTMLElement = document.createElement(obj.tagName);
    obj.children.filter(child => typeof child === 'object')
        .map(createElement).forEach(el => element.appendChild(el));

    obj.children.filter(child => typeof child === 'string')
        .forEach(el => element.innerHTML += el);
    return element;
}

function DOMDriver(sink) {
    const dom: any = document.querySelector('#res');
    sink.subscribe(res => {
        dom.innerHTML = '';
        const element = createElement(res);
        dom.appendChild(element);
    });
    const DOMsource = Observable.fromEvent(document, 'click');
    return DOMsource;
}
function LOGDriver(sink) {   
    sink.subscribe(res => {
        console.log(res);
    })
}
var sub: Subscription
function run(logicFn, drivers) {
    const proxySources = {};
    Object.keys(drivers).forEach(key => {
        proxySources[key] = new Subject();
    });

    const sinks = logicFn(proxySources);

    Object.keys(drivers).forEach(key => {
        const source = drivers[key](sinks[key]);
        source && source.subscribe(res => proxySources[key].next(res));
    });
}
