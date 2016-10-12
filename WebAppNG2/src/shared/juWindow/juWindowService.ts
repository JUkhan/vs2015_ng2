import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';

@Injectable()
export class juWindowService {
    private childList: any = {};
    pWin: HTMLElement;
    $minWin = new Subject();
    parentWindow:any;
    windowConfig:any={};
    constructor() { }
    closeWindow(windowId) {
        if (this.childList[windowId] && this.childList[windowId].child) {
            this.childList[windowId].child.destroy();
            this.childList[windowId] = undefined;
        }
    }
    createWindow(winId: string){
        this.parentWindow.createWindow(winId);
    }
    getChildList() {
        return this.childList;
    }
    minWindow(windowId) {
        this.$minWin.next({ id: windowId, title: this.windowConfig[windowId].title });
    }
    syncZIndex(windowId: string) {
        for (let win in this.childList) {
            if (typeof this.childList[win] !== 'undefined') {
                if (windowId === win) {
                    this.childList[win].child.instance.setStyle('z-index', '9');
                } else {
                    this.childList[win].child.instance.setStyle('z-index', '8');
                }
            }
        }
    }
    getComponent(windowId: string) {
        return this.windowConfig[windowId].loader();
    }
    setProperty(windowId: string) {
        let wConfig = this.windowConfig[windowId], window = this.childList[windowId].child.instance;
        window.top = Math.floor((this.pWin.offsetHeight - wConfig.height) / 2);
        window.left = Math.floor((this.pWin.offsetWidth - wConfig.width) / 2);
        window.width = wConfig.width;
        window.height = wConfig.height;
        window.title = wConfig.title;

    }
    expandWindow(windowId, isExpand: boolean = true) {
        let window = this.childList[windowId].child.instance;
        if (isExpand) {
            window.adjustWidth(this.pWin.offsetWidth);
            window.adjustHeight(this.pWin.offsetHeight);
            window.setStyle('top', '0px');
            window.setStyle('left', '0px');
        } else {           
            window.adjustWidth(window.width);
            window.adjustHeight(window.height);
            window.setStyle('top', window.top + 'px');
            window.setStyle('left', window.left + 'px');
            window.setStyle('display', 'block');
        }
    }
    openWindow(windowId) {
        let window = this.childList[windowId].child.instance;
        window.isMax = true;
        window.adjustWidth(window.width);
        window.adjustHeight(window.height);
        window.setStyle('top', window.top + 'px');
        window.setStyle('left', window.left + 'px');
        window.setStyle('display', 'block');
        this.syncZIndex(windowId);
    }
    destroyAll() {
        for (let win in this.childList) {
            if (typeof this.childList[win] !== 'undefined') {
                if (this.childList[win].child) {
                    this.childList[win].child.destroy();
                }
            }
        }
    }
}
