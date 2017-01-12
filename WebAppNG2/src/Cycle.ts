import {Observable, Subject, Subscription} from 'rxjs/Rx';

export const h = (tgName, props: { [key: string]: any }, children:any[]) => {
    return { tagName: tgName, props: props, children: children }
}
export const div = (...params)=>{
    return h_helper('DIV', params);
}
export const h1 = (...params)=> {
    return h_helper('H1', params);
}
export const span = (...params)=> {
    return h_helper('SPAN', params);
}
export const button = (...params) => {

    return h_helper('BUTTON', params);
}
function h_helper(tagName, params) {   
    let props: { [key: string]: any } = {}, children=[];
    if (typeof params[0] === 'string') {
        if (params[0].indexOf('.')==0) {
            props['class'] = params[0].substr(1);
        }
        if (params[0].indexOf('#')==0) {
            props['id'] = params[0].substr(1);
        }
    }
    else if (Array.isArray(params[0])) {
        children = params[0];
    }

    
    if (Array.isArray(params[1])) {
        children = params[1];
    }
    else if (typeof params[1] === 'object') {
        props = Object.assign({}, props, params[1])
    }
    if (Array.isArray(params[2])) {
        children = params[2];
    }
    return h(tagName, props, children);
}
function createElement(obj) {    
    const el = document.createElement(obj.tagName);
    Object.keys(obj.props).forEach(prop => {        
        el.setAttribute(prop, obj.props[prop]);
    });
    obj.children.filter(child => typeof child === 'object').map(createElement).forEach(ch => {
        el.appendChild(ch);
    });
    obj.children.filter(child => typeof child === 'string').map(str => el.innerHTML += str);
    return el;
}

export const makeDomDriver = function (container) {
    ProxySubject.container = container; console.log('makeDomDriver', ProxySubject.container)
    return function domDriver(sink) {        
        sink.subscribe(res => {
            const el = createElement(res);
            container.innerHTML = '';
            container.appendChild(el);
            console.log('sub->',res);
        });
        return Observable.fromEvent(document, 'click');
    }
}

export const run = function (mainFn, drivers) {    
    const domProxy = {};
    Object.keys(drivers).forEach(key => {
        domProxy[key] = new ProxySubject();
    });
    const sinks = mainFn(domProxy);

    Object.keys(drivers).forEach(key => {
        const res = drivers[key](sinks[key]);
        res && res.subscribe(res => domProxy[key].next(res))
    });
}

class ProxySubject extends Subject<any> {
    constructor() {
        super();
    }
    static container: any;
    select(selector, eventName) {
        console.log('selector...', ProxySubject.container);
        const dom = ProxySubject.container.querySelector(selector);
        console.log('dom', dom, selector);
        if(dom)
            return Observable.fromEvent(dom, eventName);
        return this;
    }
    events() {

    }
}
