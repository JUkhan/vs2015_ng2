import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class UiService {
    public documentClick: Observable<any>;
    constructor() {
        this.setEventListeners();
    }
    setEventListeners() {
        this.documentClick = Observable.fromEvent(document, 'mousedown');
    }
    hasParent(el, parentSelector /* optional */) {
        if (parentSelector === undefined) {
            parentSelector = document;
        }
        var p = el.parentNode;
        while (p !== parentSelector) {
            var o = p;
            p = o.parentNode;
            if (p == null) {
                return false;
            }
        }
        return true;
    }

}