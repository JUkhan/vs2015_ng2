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
var juWindowService_1 = require('../../shared/juWindow/juWindowService');
var FV_1 = require('../../shared/juForm/FV');
var WindowComponent = (function () {
    function WindowComponent(service) {
        this.service = service;
    }
    WindowComponent.prototype.ngOnInit = function () {
        this.initForm();
    };
    WindowComponent.prototype.initForm = function () {
        this.formDefs = {
            title: 'Scholar',
            labelPos: 'left',
            labelSize: 3,
            inputs: [
                { field: 'name', label: 'Name', type: 'text', validators: [FV_1.FV.required, FV_1.FV.minLength(5)] },
                { field: 'education', width: 222, label: 'Education', type: 'datepicker', validators: FV_1.FV.required },
                { field: 'address', label: 'Address', type: 'text', validators: FV_1.FV.required },
                { field: 'age', label: 'Age', type: 'text', validators: [FV_1.FV.required, FV_1.FV.regex(/^\d+$/, 'Age should be a number')] },
                { field: 'description', label: 'Description', type: 'textarea' }
            ],
            buttons: {
                'Save Change': { type: 'submit', cssClass: 'btn btn-success', click: this.submitScholar.bind(this) },
                'Close': { type: 'close', cssClass: 'btn btn-default' }
            }
        };
    };
    WindowComponent.prototype.submitScholar = function () {
        alert('submitted');
    };
    WindowComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'test-component',
            template: "<div>  \n    <df [options]=\"formDefs\"></df></div>\n    ",
            styles: ["\n          .wnav{margin-top:1px;}  \n    "],
            encapsulation: core_1.ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [juWindowService_1.juWindowService])
    ], WindowComponent);
    return WindowComponent;
}());
exports.WindowComponent = WindowComponent;
//# sourceMappingURL=windowExample.js.map