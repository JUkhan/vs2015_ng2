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
var app_service_1 = require('./shared/app.service');
var AppComponent = (function () {
    function AppComponent(service) {
        this.service = service;
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.setMenu();
        this.service.notifier$.subscribe(function (it) {
            switch (it.key) {
                case 'messageDialog':
                    _this.messageDialog.showDialog(it.value.title, it.value.message);
                    break;
                case 'confirmDialog':
                    _this.confirmDialog.showDialog(it.value.title, it.value.message, it.value.yesCallback, it.value.noCallback);
                    break;
            }
        });
    };
    AppComponent.prototype.setMenu = function () {
        this.menuData = [
            { name: 'Home', link: 'home', icon: 'fa fa-home' },
            { name: 'CRUD', link: 'setting', icon: 'fa fa-home' },
            { name: 'Tree View', link: 'setting/treeView', icon: 'fa fa-home' },
            { name: 'Cell Edit', link: 'setting/cellEdit', icon: 'fa fa-home' },
            { name: 'Window', link: 'setting/window', icon: 'fa fa-home' },
            {
                name: 'Settings', icon: 'fa fa-gear', items: [
                    { name: 'CRUD Example', link: 'setting', icon: 'fa fa-home' },
                    { name: 'Upload', link: 'setting/upload', icon: 'fa fa-home' }
                ]
            },
        ];
    };
    AppComponent.prototype.messageLoad = function (message) {
        this.messageDialog = message;
    };
    AppComponent.prototype.confirmLoad = function (confirm) {
        this.confirmDialog = confirm;
    };
    AppComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-app',
            templateUrl: './app.component.html'
        }), 
        __metadata('design:paramtypes', [app_service_1.AppService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map