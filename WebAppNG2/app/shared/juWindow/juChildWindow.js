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
var juWindowService_1 = require('./juWindowService');
var Rx_1 = require('rxjs/Rx');
var juChildWindow = (function () {
    function juChildWindow(service, dcl, injector, appRef, renderer) {
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
    juChildWindow.prototype.ngOnInit = function () {
    };
    juChildWindow.prototype.ngOnDestroy = function () {
        this.subList.forEach(function (_) {
            if (!_.isUnsubscribed) {
                _.unsubscribe();
                _.remove(_);
            }
        });
        this.compRef.destroy();
    };
    juChildWindow.prototype.ngAfterViewInit = function () {
        this.moveWindow();
        this.addListeners();
        this.service.syncZIndex(this.windowId);
        this.loadComponent();
        this.adjustHeight(this.height);
        this.adjustWidth(this.width);
    };
    juChildWindow.prototype.loadComponent = function () {
        var _this = this;
        this.dcl.loadAsRoot(this.service.getComponent(this.windowId), this.placeholder.nativeElement, this.injector)
            .then((function (compRef) {
            _this.compRef = compRef;
            _this.appRef._loadComponent(compRef);
            compRef.onDestroy(function () {
                _this.appRef._unloadComponent(compRef);
            });
            return compRef;
        }));
    };
    Object.defineProperty(juChildWindow.prototype, "width", {
        get: function () { return this._width; },
        set: function (val) {
            this._width = val;
            this.adjustWidth(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(juChildWindow.prototype, "height", {
        get: function () { return this._height; },
        set: function (val) {
            this._height = val;
            this.adjustHeight(val);
        },
        enumerable: true,
        configurable: true
    });
    juChildWindow.prototype.addListeners = function () {
        var _this = this;
        var mousedown$ = Rx_1.Observable.fromEvent(this.header.nativeElement, 'mousedown'), mousemove$ = Rx_1.Observable.fromEvent(document, 'mousemove'), mouseup$ = Rx_1.Observable.fromEvent(document, 'mouseup');
        this.subList.push(mousedown$.filter(function (e) { return _this.isMax; }).flatMap(function (md) {
            var startX = md.clientX + window.scrollX, startY = md.clientY + window.scrollY, startLeft = +_this.left, startTop = +_this.top;
            _this.setStyle('z-index', '10');
            _this.renderer.setElementStyle(_this.header.nativeElement, 'cursor', 'move');
            return mousemove$
                .map(function (mm) {
                return {
                    left: startLeft + mm.clientX - startX,
                    top: startTop + mm.clientY - startY
                };
            })
                .takeUntil(mouseup$);
        }).subscribe(function (val) {
            _this.top = val.top < 0 ? 0 : val.top;
            _this.left = val.left;
            _this.moveWindow();
        }));
        this.subList.push(mouseup$.subscribe(function (e) {
            _this.service.syncZIndex(_this.windowId);
            _this.renderer.setElementStyle(_this.header.nativeElement, 'cursor', 'default');
        }));
    };
    juChildWindow.prototype.windowResizeListener = function () {
        var _this = this;
        var mousemove$ = Rx_1.Observable.fromEvent(this.window.nativeElement, 'mousemove');
        mousemove$.subscribe(function (e) {
            console.log(e.x - _this.left, e.y - _this.top);
        });
    };
    juChildWindow.prototype.closeWindow = function (event) {
        this.service.closeWindow(this.windowId);
    };
    juChildWindow.prototype.minimizeWindow = function (event) {
        this.setStyle('display', 'none');
        this.service.minWindow(this.windowId);
    };
    juChildWindow.prototype.expandWindow = function (event) {
        this.service.expandWindow(this.windowId, this.isMax);
        this.isMax = !this.isMax;
    };
    juChildWindow.prototype.moveWindow = function () {
        this.renderer.setElementStyle(this.window.nativeElement, 'top', this.top + 'px');
        this.renderer.setElementStyle(this.window.nativeElement, 'left', this.left + 'px');
    };
    juChildWindow.prototype.setStyle = function (styleName, styleValue) {
        this.renderer.setElementStyle(this.window.nativeElement, styleName, styleValue);
    };
    juChildWindow.prototype.onBodyClick = function () {
        this.service.syncZIndex(this.windowId);
    };
    juChildWindow.prototype.adjustWidth = function (width) {
        this.setStyle('width', width + 'px');
        this.renderer.setElementStyle(this.placeholder.nativeElement, 'width', (width - 2) + 'px');
    };
    juChildWindow.prototype.adjustHeight = function (height) {
        this.setStyle('height', height + 'px');
        this.renderer.setElementStyle(this.placeholder.nativeElement, 'height', (height - 35) + 'px');
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
            template: "<div class=\"popup\" #window (click)=\"onBodyClick()\">\n    <div class=\"header\" #header>\n        <span>{{title}}</span>\n        <span class=\"min-max-close\">\n                    <a href=\"javascript:;\" title=\"Minimize\" (click)=\"minimizeWindow($event)\"><b class=\"fa fa-minus\"></b></a>\n                    <a href=\"javascript:;\" title=\"{{isMax?'Maximize':'Normal'}}\" (click)=\"expandWindow($event)\"><b class=\"fa fa-{{isMax?'expand':'compress'}}\"></b></a>\n                    <a href=\"javascript:;\" title=\"Close\" (click)=\"closeWindow($event)\"><b class=\"fa fa-remove\"></b></a>\n                </span>\n    </div>\n    <div class=\"popup-content\" #placeholder>\n        \n    </div>\n</div>"
        }), 
        __metadata('design:paramtypes', [juWindowService_1.juWindowService, core_1.DynamicComponentLoader, core_1.Injector, core_1.ApplicationRef, core_1.Renderer])
    ], juChildWindow);
    return juChildWindow;
}());
exports.juChildWindow = juChildWindow;
//# sourceMappingURL=juChildWindow.js.map