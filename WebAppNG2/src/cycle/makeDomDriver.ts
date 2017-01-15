import {Observable, Subject, Subscription} from 'rxjs/Rx';
import {createElement} from './dom';
export const makeDomDriver = function (container) {   
    return function domDriver(sink) {
        sink.subscribe(res => {
            console.log('dom-update');
            const el = createElement(res);
            container.innerHTML = '';
            container.appendChild(el);            
        });
        return {
            selectEvents(cssClass, eventName) {
                return Observable.fromEvent(document, eventName)
                    .filter((ev: any) => !!Array.from(ev.target.classList).find(name => '.'+name === cssClass));
                    
            }
        }
    }
}