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
const juWindowService_1 = require('../../shared/juWindow/juWindowService');
const crudExample_1 = require('../grid/crudExample');
let WindowComponent = class WindowComponent {
    constructor(service) {
        this.service = service;
    }
    ngOnInit() {
        this.service.windowConfig = {
            'about': { title: 'About us', width: 600, height: 400, loader: () => crudExample_1.CrudExample },
        };
    }
};
WindowComponent = __decorate([
    core_1.Component({
        selector: 'window-component',
        template: `
    <div class="wnav">
        <input type="button" class="btn btn-success" value="Form" (click)="service.createWindow('form')">
        <input type="button" class="btn btn-success" value="Grid" (click)="service.createWindow('grid')">
        <input type="button" class="btn btn-success" value="About" (click)="service.createWindow('about')">
    </div>
    <div class="pw" height="500"></div>
    `
    }), 
    __metadata('design:paramtypes', [juWindowService_1.juWindowService])
], WindowComponent);
exports.WindowComponent = WindowComponent;
