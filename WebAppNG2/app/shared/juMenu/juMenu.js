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
var juMenu = (function () {
    function juMenu() {
    }
    juMenu.prototype.ngOnInit = function () {
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], juMenu.prototype, "menuData", void 0);
    juMenu = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: '[juMenu], juMenu',
            host: { 'class': 'collapse navbar-collapse' },
            template: "<ng-content></ng-content>\n<ul class=\"nav navbar-nav\">\n    <li [routerLinkActive]=\"['active']\" [routerLinkActiveOptions]=\"{exact:true}\" *ngFor=\"let item of menuData\">\n        <template [ngIf]=\"item.items\">\n            <a href=\"javascript:;\" class=\"dropdown-toggle\" data-toggle=\"dropdown\"><b class=\"{{item.icon}}\"></b> {{item.name}} <b class=\"caret\"></b></a>\n            <ul class=\"dropdown-menu multi-level\"> \n                <li [routerLinkActive]=\"['active']\" [routerLinkActiveOptions]=\"{exact:true}\" [class.dropdown-submenu]=\"item2.items\" *ngFor=\"let item2 of item.items\">\n                    <template [ngIf]=\"item2.items\">\n                        <a href=\"javascript:;\" class=\"dropdown-toggle\" data-toggle=\"dropdown\"><b class=\"{{item2.icon}}\"></b> {{item2.name}} </a>\n                        <ul class=\"dropdown-menu\">\n                            <li [routerLinkActive]=\"['active']\" [routerLinkActiveOptions]=\"{exact:true}\" [class.dropdown-submenu]=\"item3.items\" *ngFor=\"let item3 of item2.items\">\n                                <template [ngIf]=\"item3.items\">\n                                    <a href=\"javascript:;\" class=\"dropdown-toggle\" data-toggle=\"dropdown\"><b class=\"{{item3.icon}}\"></b> {{item3.name}} </a>\n                                    <ul class=\"dropdown-menu\">\n                                        <li [routerLinkActive]=\"['active']\" [routerLinkActiveOptions]=\"{exact:true}\" [class.dropdown-submenu]=\"item4.items\" *ngFor=\"let item4 of item3.items\">\n                                            <template [ngIf]=\"item4.items\">\n                                                <a href=\"javascript:;\" class=\"dropdown-toggle\" data-toggle=\"dropdown\"><b class=\"{{item4.icon}}\"></b> {{item4.name}} </a>\n                                                <ul class=\"dropdown-menu\">\n                                                    <li [routerLinkActive]=\"['active']\" [routerLinkActiveOptions]=\"{exact:true}\" [class.dropdown-submenu]=\"item5.items\" *ngFor=\"let item5 of item4.items\">\n                                                        <a [routerLink]=\"item5.link\"><b class=\"{{item5.icon}}\"></b> {{item5.name}}</a>\n                                                    </li>\n                                                </ul>\n                                            </template>\n                                            <a *ngIf=\"!item4.items\" [routerLink]=\"item4.link\"><b class=\"{{item4.icon}}\"></b> {{item4.name}}</a>\n                                        </li>\n                                    </ul>\n                                </template>\n                                <a *ngIf=\"!item3.items\" [routerLink]=\"item3.link\"><b class=\"{{item3.icon}}\"></b> {{item3.name}}</a>\n                            </li>\n                        </ul>\n                    </template>\n                    <a *ngIf=\"!item2.items\" [routerLink]=\"item2.link\"><b class=\"{{item2.icon}}\"></b> {{item2.name}}</a>\n                </li>\n            </ul>\n        </template>\n        <a *ngIf=\"!item.items\" [routerLink]=\"item.link\"><b class=\"{{item.icon}}\"></b> {{item.name}}</a>\n        \n    </li>\n    \n</ul>\n"
        }), 
        __metadata('design:paramtypes', [])
    ], juMenu);
    return juMenu;
}());
exports.juMenu = juMenu;
//# sourceMappingURL=juMenu.js.map