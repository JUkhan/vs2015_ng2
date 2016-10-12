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
const juChildWindow_1 = require('./juChildWindow');
const juWindowService_1 = require('./juWindowService');
let juParentWindow = class juParentWindow {
    constructor(renderer, dcl, injector, appRef, service) {
        this.renderer = renderer;
        this.dcl = dcl;
        this.injector = injector;
        this.appRef = appRef;
        this.service = service;
        this.minList = [];
        this.subsList = [];
        this.height = 500;
    }
    ngOnInit() {
        this.childList = this.service.getChildList();
        this.subsList.push(this.service.$minWin.subscribe(next => {
            this.minList.push(next);
        }));
        this.service.parentWindow = this;
    }
    ngOnDestroy() {
        this.service.destroyAll();
        this.subsList.forEach(_ => {
            if (!_.unsubscribe) {
                _.unsubscribe();
            }
        });
    }
    ngAfterViewInit() {
        this.service.pWin = this.container.nativeElement;
        this.container.nativeElement.style.height = this.height + 'px';
    }
    openWindow(item) {
        this.minList.splice(this.minList.indexOf(item), 1);
        this.service.openWindow(item.id);
    }
    closeWindow(item) {
        this.minList.splice(this.minList.indexOf(item), 1);
        this.service.closeWindow(item.id);
    }
    createWindow(id) {
        this.createPlaceHolder(id);
    }
    createPlaceHolder(id) {
        if (typeof this.childList[id] === 'undefined') {
            this.placeHolder = this.renderer.createElement(this.container.nativeElement, 'div');
            this.childList[id] = {};
            this.loadComponent(id);
        }
        else {
            let item = this.minList.filter(_ => _.id === id);
            this.minList.splice(this.minList.indexOf(item), 1);
            this.service.openWindow(id);
        }
    }
    loadComponent(id) {
        let comOptions = this.childList[id];
        if (typeof comOptions.child === 'undefined') {
            this.dcl.loadAsRoot(juChildWindow_1.juChildWindow, this.placeHolder, this.injector)
                .then((compRef) => {
                comOptions.child = compRef;
                compRef.instance.windowId = id;
                this.service.setProperty(id);
                compRef.onDestroy(() => {
                });
                return compRef;
            });
        }
    }
};
__decorate([
    core_1.ViewChild('container'), 
    __metadata('design:type', core_1.ElementRef)
], juParentWindow.prototype, "container", void 0);
__decorate([
    core_1.ViewChild('footer'), 
    __metadata('design:type', core_1.ElementRef)
], juParentWindow.prototype, "footer", void 0);
juParentWindow = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'pw, .pw',
        encapsulation: core_1.ViewEncapsulation.None,
        inputs: ['height'],
        template: `<div class="window">    
    <div class="wcontent" #container></div>
    <div class="footer" #footer>
        <ul class="list-group">
            <li class="list-group-item" *ngFor="let item of minList" [title]="item.title">                 
                <span>{{item.title}} </span>
                <span class="">
                    <a href="javascript:;" title="Open" (click)="openWindow(item)"><b class="fa fa-expand"></b></a>
                    <a href="javascript:;" title="Close" (click)="closeWindow(item)"><b class="fa fa-remove"></b></a>
                 </span>
                </li>
            
        </ul>
    </div>
</div>`
    }), 
    __metadata('design:paramtypes', [core_1.Renderer, Object, core_1.Injector, core_1.ApplicationRef, juWindowService_1.juWindowService])
], juParentWindow);
exports.juParentWindow = juParentWindow;

//# sourceMappingURL=juParentWindow.js.map
