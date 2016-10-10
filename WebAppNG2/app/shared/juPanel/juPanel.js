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
let juPanel = class juPanel {
    constructor(el) {
        this.el = el;
        this.viewMode = 'accordion';
        this.onActive = new core_1.EventEmitter();
        this.contentList = [];
    }
    insertContent(content) {
        this.contentList.push(content);
    }
    removeContent(content) {
        this.contentList.splice(this.contentList.indexOf(content), 1);
    }
    select(content) {
        this.contentList.forEach((p) => p.active = p == content);
        this.onActive.next(content);
    }
};
juPanel = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'juPanel,[juPanel]',
        inputs: ['viewMode'],
        outputs: ['onActive'],
        encapsulation: core_1.ViewEncapsulation.None,
        template: `<div [class.card]="viewMode==='tab'">
    <ul class="nav nav-tabs" *ngIf="viewMode==='tab'">
        <li *ngFor="let pane of contentList" (click)="select(pane)" role="presentation" [class.active]="pane.active">
            <a>{{pane.title}}</a>
        </li>
    </ul>
    <div [class.tab-content]="viewMode==='tab'">
        <ng-content></ng-content>
    </div>
</div>`
    }), 
    __metadata('design:paramtypes', [core_1.ElementRef])
], juPanel);
exports.juPanel = juPanel;
