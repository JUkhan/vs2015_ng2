"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const core_1 = require('@angular/core');
const Rx_1 = require('rxjs/Rx');
let juWindowService = class juWindowService {
    constructor() {
        this.childList = {};
        this.$minWin = new Rx_1.Subject();
        this.windowConfig = {};
    }
    closeWindow(windowId) {
        if (this.childList[windowId] && this.childList[windowId].child) {
            this.childList[windowId].child.destroy();
            this.childList[windowId] = undefined;
        }
    }
    createWindow(winId) {
        this.parentWindow.createWindow(winId);
    }
    getChildList() {
        return this.childList;
    }
    minWindow(windowId) {
        this.$minWin.next({ id: windowId, title: this.windowConfig[windowId].title });
    }
    syncZIndex(windowId) {
        for (let win in this.childList) {
            if (typeof this.childList[win] !== 'undefined') {
                if (windowId === win) {
                    this.childList[win].child.instance.setStyle('z-index', '9');
                }
                else {
                    this.childList[win].child.instance.setStyle('z-index', '8');
                }
            }
        }
    }
    getComponent(windowId) {
        return this.windowConfig[windowId].loader();
    }
    setProperty(windowId) {
        let wConfig = this.windowConfig[windowId], window = this.childList[windowId].child.instance;
        window.top = Math.floor((this.pWin.offsetHeight - wConfig.height) / 2);
        window.left = Math.floor((this.pWin.offsetWidth - wConfig.width) / 2);
        window.width = wConfig.width;
        window.height = wConfig.height;
        window.title = wConfig.title;
    }
    expandWindow(windowId, isExpand = true) {
        let window = this.childList[windowId].child.instance;
        if (isExpand) {
            window.adjustWidth(this.pWin.offsetWidth);
            window.adjustHeight(this.pWin.offsetHeight);
            window.setStyle('top', '0px');
            window.setStyle('left', '0px');
        }
        else {
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
};
juWindowService = __decorate([
    core_1.Injectable(), 
    __metadata('design:paramtypes', [])
], juWindowService);
exports.juWindowService = juWindowService;
