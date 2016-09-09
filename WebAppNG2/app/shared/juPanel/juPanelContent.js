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
var juPanel_1 = require('./juPanel');
var juPanelContent = (function () {
    function juPanelContent(panel, elementRef) {
        this.panel = panel;
        this.elementRef = elementRef;
        this._active = false;
        this._clickOnToggle = false;
        this.slideState = '';
        panel.insertContent(this);
    }
    juPanelContent.prototype.ngOnInit = function () {
    };
    juPanelContent.prototype.ngAfterContentInit = function () {
        this.slideState = this.active ? 'down' : 'up';
    };
    juPanelContent.prototype.ngOnDestroy = function () {
        this.panel.removeContent(this);
    };
    Object.defineProperty(juPanelContent.prototype, "active", {
        get: function () {
            return this._active;
        },
        set: function (val) {
            this._active = val;
            if (!this._clickOnToggle) {
                this.slideState = this.active ? 'down' : 'up';
            }
            else {
                this._clickOnToggle = false;
            }
        },
        enumerable: true,
        configurable: true
    });
    juPanelContent.prototype.slideToggle = function () {
        this._clickOnToggle = true;
        this.active = !this.active;
        this.slideState = this.active ? 'down' : 'up';
    };
    juPanelContent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'content, [content]',
            templateUrl: './juPanelContent.html',
            inputs: ['title', 'active'],
            encapsulation: core_1.ViewEncapsulation.None,
            animations: [
                core_1.trigger('slide', [
                    core_1.state('up', core_1.style({ opacity: 0, height: 0 })),
                    core_1.state('down', core_1.style({ opacity: 1, height: '*' })),
                    core_1.transition('up => down', core_1.animate('300ms ease-in')),
                    core_1.transition('down => up', core_1.animate('300ms ease-out'))
                ])
            ]
        }), 
        __metadata('design:paramtypes', [juPanel_1.juPanel, core_1.ElementRef])
    ], juPanelContent);
    return juPanelContent;
}());
exports.juPanelContent = juPanelContent;
//# sourceMappingURL=juPanelContent.js.map