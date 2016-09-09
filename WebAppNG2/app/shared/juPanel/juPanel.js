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
var juPanel = (function () {
    function juPanel(el) {
        this.el = el;
        this.viewMode = 'accordion';
        this.onActive = new core_1.EventEmitter();
        this.contentList = [];
    }
    juPanel.prototype.insertContent = function (content) {
        this.contentList.push(content);
    };
    juPanel.prototype.removeContent = function (content) {
        this.contentList.splice(this.contentList.indexOf(content), 1);
    };
    juPanel.prototype.select = function (content) {
        this.contentList.forEach(function (p) { return p.active = p == content; });
        this.onActive.next(content);
    };
    juPanel = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'juPanel,[juPanel]',
            templateUrl: './juPanel.html',
            styleUrls: ['./juPanel.css'],
            inputs: ['viewMode'],
            outputs: ['onActive'],
            encapsulation: core_1.ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], juPanel);
    return juPanel;
}());
exports.juPanel = juPanel;
//# sourceMappingURL=juPanel.js.map