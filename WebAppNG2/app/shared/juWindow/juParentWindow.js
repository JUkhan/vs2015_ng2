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
var core_1 = require('@angular/core');
var juChildWindow_1 = require('./juChildWindow');
var juWindowService_1 = require('./juWindowService');
var juParentWindow = (function () {
    function juParentWindow(renderer, dcl, injector, appRef, service) {
        this.renderer = renderer;
        this.dcl = dcl;
        this.injector = injector;
        this.appRef = appRef;
        this.service = service;
        this.minList = [];
        this.subsList = [];
        this.height = 500;
    }
    juParentWindow.prototype.ngOnInit = function () {
        var _this = this;
        this.childList = this.service.getChildList();
        this.subsList.push(this.service.$minWin.subscribe(function (next) {
            _this.minList.push(next);
        }));
        this.service.parentWindow = this;
    };
    juParentWindow.prototype.ngOnDestroy = function () {
        this.service.destroyAll();
        this.subsList.forEach(function (_) {
            if (!_.unsubscribe) {
                _.unsubscribe();
            }
        });
    };
    juParentWindow.prototype.ngAfterViewInit = function () {
        this.service.pWin = this.container.nativeElement;
        this.container.nativeElement.style.height = this.height + 'px';
    };
    juParentWindow.prototype.openWindow = function (item) {
        this.minList.splice(this.minList.indexOf(item), 1);
        this.service.openWindow(item.id);
    };
    juParentWindow.prototype.closeWindow = function (item) {
        this.minList.splice(this.minList.indexOf(item), 1);
        this.service.closeWindow(item.id);
    };
    juParentWindow.prototype.createWindow = function (id) {
        this.createPlaceHolder(id);
    };
    juParentWindow.prototype.createPlaceHolder = function (id) {
        if (typeof this.childList[id] === 'undefined') {
            this.placeHolder = this.renderer.createElement(this.container.nativeElement, 'div');
            this.childList[id] = {};
            this.loadComponent(id);
        }
        else {
            var item = this.minList.filter(function (_) { return _.id === id; });
            this.minList.splice(this.minList.indexOf(item), 1);
            this.service.openWindow(id);
        }
    };
    juParentWindow.prototype.loadComponent = function (id) {
        var _this = this;
        var comOptions = this.childList[id];
        if (typeof comOptions.child === 'undefined') {
            this.dcl.loadAsRoot(juChildWindow_1.juChildWindow, this.placeHolder, this.injector)
                .then(function (compRef) {
                comOptions.child = compRef;
                compRef.instance.windowId = id;
                _this.service.setProperty(id);
                compRef.onDestroy(function () {
                });
                return compRef;
            });
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
            template: "<div class=\"window\">    \n    <div class=\"wcontent\" #container></div>\n    <div class=\"footer\" #footer>\n        <ul class=\"list-group\">\n            <li class=\"list-group-item\" *ngFor=\"let item of minList\" [title]=\"item.title\">                 \n                <span>{{item.title}} </span>\n                <span class=\"\">\n                    <a href=\"javascript:;\" title=\"Open\" (click)=\"openWindow(item)\"><b class=\"fa fa-expand\"></b></a>\n                    <a href=\"javascript:;\" title=\"Close\" (click)=\"closeWindow(item)\"><b class=\"fa fa-remove\"></b></a>\n                 </span>\n                </li>\n            \n        </ul>\n    </div>\n</div>"
        }), 
        __metadata('design:paramtypes', [core_1.Renderer, core_1.DynamicComponentLoader, core_1.Injector, core_1.ApplicationRef, juWindowService_1.juWindowService])
    ], juParentWindow);
    return juParentWindow;
}());
exports.juParentWindow = juParentWindow;
//# sourceMappingURL=juParentWindow.js.map