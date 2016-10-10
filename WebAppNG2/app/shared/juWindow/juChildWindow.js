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
const juWindowService_1 = require('./juWindowService');
const Rx_1 = require('rxjs/Rx');
let juChildWindow = class juChildWindow {
    constructor(service, dcl, injector, appRef, renderer) {
        this.service = service;
        this.dcl = dcl;
        this.injector = injector;
        this.appRef = appRef;
        this.renderer = renderer;
        this.title = 'title';
        this.top = 200;
        this.left = 300;
        this.isMax = true;
        this.subList = [];
    }
    ngOnInit() {
    }
    ngOnDestroy() {
        this.subList.forEach(_ => {
            _.unsubscribe();
            _.remove(_);
        });
        this.compRef.destroy();
    }
    ngAfterViewInit() {
        this.moveWindow();
        this.addListeners();
        this.service.syncZIndex(this.windowId);
        this.loadComponent();
        this.adjustHeight(this.height);
        this.adjustWidth(this.width);
    }
    loadComponent() {
        this.dcl.loadAsRoot(this.service.getComponent(this.windowId), this.placeholder.nativeElement, this.injector)
            .then((compRef => {
            this.compRef = compRef;
            this.appRef._loadComponent(compRef);
            compRef.onDestroy(() => {
                this.appRef._unloadComponent(compRef);
            });
            return compRef;
        }));
    }
    set width(val) {
        this._width = val;
        this.adjustWidth(val);
    }
    set height(val) {
        this._height = val;
        this.adjustHeight(val);
    }
    get height() { return this._height; }
    get width() { return this._width; }
    addListeners() {
        let mousedown$ = Rx_1.Observable.fromEvent(this.header.nativeElement, 'mousedown'), mousemove$ = Rx_1.Observable.fromEvent(document, 'mousemove'), mouseup$ = Rx_1.Observable.fromEvent(document, 'mouseup');
        this.subList.push(mousedown$.filter((e) => this.isMax).flatMap((md) => {
            const startX = md.clientX + window.scrollX, startY = md.clientY + window.scrollY, startLeft = +this.left, startTop = +this.top;
            this.setStyle('z-index', '10');
            this.renderer.setElementStyle(this.header.nativeElement, 'cursor', 'move');
            return mousemove$
                .map((mm) => {
                return {
                    left: startLeft + mm.clientX - startX,
                    top: startTop + mm.clientY - startY
                };
            })
                .takeUntil(mouseup$);
        }).subscribe((val) => {
            this.top = val.top < 0 ? 0 : val.top;
            this.left = val.left;
            this.moveWindow();
        }));
        this.subList.push(mouseup$.subscribe(e => {
            this.service.syncZIndex(this.windowId);
            this.renderer.setElementStyle(this.header.nativeElement, 'cursor', 'default');
        }));
    }
    windowResizeListener() {
        let mousemove$ = Rx_1.Observable.fromEvent(this.window.nativeElement, 'mousemove');
        mousemove$.subscribe(e => {
            console.log(e.x - this.left, e.y - this.top);
        });
    }
    closeWindow(event) {
        this.service.closeWindow(this.windowId);
    }
    minimizeWindow(event) {
        this.setStyle('display', 'none');
        this.service.minWindow(this.windowId);
    }
    expandWindow(event) {
        this.service.expandWindow(this.windowId, this.isMax);
        this.isMax = !this.isMax;
    }
    moveWindow() {
        this.renderer.setElementStyle(this.window.nativeElement, 'top', this.top + 'px');
        this.renderer.setElementStyle(this.window.nativeElement, 'left', this.left + 'px');
    }
    setStyle(styleName, styleValue) {
        this.renderer.setElementStyle(this.window.nativeElement, styleName, styleValue);
    }
    onBodyClick() {
        this.service.syncZIndex(this.windowId);
    }
    adjustWidth(width) {
        this.setStyle('width', width + 'px');
        this.renderer.setElementStyle(this.placeholder.nativeElement, 'width', (width - 2) + 'px');
    }
    adjustHeight(height) {
        this.setStyle('height', height + 'px');
        this.renderer.setElementStyle(this.placeholder.nativeElement, 'height', (height - 35) + 'px');
    }
};
__decorate([
    core_1.ViewChild('header'), 
    __metadata('design:type', core_1.ElementRef)
], juChildWindow.prototype, "header", void 0);
__decorate([
    core_1.ViewChild('window'), 
    __metadata('design:type', core_1.ElementRef)
], juChildWindow.prototype, "window", void 0);
__decorate([
    core_1.ViewChild('placeholder'), 
    __metadata('design:type', core_1.ElementRef)
], juChildWindow.prototype, "placeholder", void 0);
juChildWindow = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'child-window',
        encapsulation: core_1.ViewEncapsulation.None,
        template: `<div class="popup" #window (click)="onBodyClick()">
    <div class="header" #header>
        <span>{{title}}</span>
        <span class="min-max-close">
                    <a href="javascript:;" title="Minimize" (click)="minimizeWindow($event)"><b class="fa fa-minus"></b></a>
                    <a href="javascript:;" title="{{isMax?'Maximize':'Normal'}}" (click)="expandWindow($event)"><b class="fa fa-{{isMax?'expand':'compress'}}"></b></a>
                    <a href="javascript:;" title="Close" (click)="closeWindow($event)"><b class="fa fa-remove"></b></a>
                </span>
    </div>
    <div class="popup-content" #placeholder>
        
    </div>
</div>`
    }), 
    __metadata('design:paramtypes', [juWindowService_1.juWindowService, Object, core_1.Injector, core_1.ApplicationRef, core_1.Renderer])
], juChildWindow);
exports.juChildWindow = juChildWindow;
