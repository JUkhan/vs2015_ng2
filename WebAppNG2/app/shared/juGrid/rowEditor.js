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
const juSelect_1 = require('../juForm/juSelect');
const Datetimepicker_1 = require('../juForm/Datetimepicker');
const Rx_1 = require('rxjs/Rx');
let rowEditor = class rowEditor {
    constructor(el) {
        this.el = el;
        this.isUpdated = false;
        this.subsList = [];
        this.validationMsg = {};
    }
    ngAfterContentInit() {
        this.eventBinding(this.el.nativeElement.querySelectorAll('.select'), 'change');
        this.eventBinding(this.el.nativeElement.querySelectorAll('.text'), 'change');
        this.juSelectList.toArray().forEach(_ => {
            this.subsList.push(_.notifyRowEditor.subscribe(() => { this.isUpdated = true; }));
        });
        this.datepickerList.toArray().forEach(_ => {
            this.subsList.push(_.notifyRowEditor.subscribe(() => { this.isUpdated = true; }));
        });
    }
    ngOnInit() {
    }
    ngOnDestroy() {
        this.subsList.forEach(_ => {
            _.unsubscribe();
            _.remove(_);
        });
    }
    isValid(fieldName) {
        let def = this.config.columnDefs.find(_ => _.field === fieldName), res = true;
        if (def) {
            res = this.validate_input(this.model[fieldName], fieldName, def);
        }
        return { 'validation-msg-show': !res, 'validation-msg-hide': res };
    }
    getValidationMsg(fieldName) {
        return this.validationMsg[fieldName];
    }
    setJuSelectData(key, value) {
        try {
            this.juSelectList.toArray().find(_ => _.propertyName === key).setData(value);
        }
        catch (er) {
            console.error(`Did not find the field name '${key}'`);
        }
    }
    eventBinding(list, eventName) {
        for (var i = 0; i < list.length; i++) {
            this.subsList.push(Rx_1.Observable.fromEvent(list[i], eventName).subscribe(e => {
                this.isUpdated = true;
            }));
        }
    }
    validate_input(val, field, def) {
        let res = true;
        if (def.validators) {
            if (Array.isArray(def.validators) && def.validators.length > 0) {
                let len = def.validators.length, i = 0;
                while (i < len && (res = this.validate_input_helper(val, field, def.validators[i]))) {
                    i++;
                }
            }
            else if (typeof def.validators === 'function') {
                res = this.validate_input_helper(val, field, def.validators);
            }
        }
        return res;
    }
    validate_input_helper(val, field, fx) {
        let msg = fx(val, field);
        if (typeof msg === 'string') {
            this.validationMsg[field] = msg;
            return false;
        }
        return true;
    }
};
__decorate([
    core_1.ContentChildren(juSelect_1.juSelect), 
    __metadata('design:type', core_1.QueryList)
], rowEditor.prototype, "juSelectList", void 0);
__decorate([
    core_1.ContentChildren(Datetimepicker_1.Datetimepicker), 
    __metadata('design:type', core_1.QueryList)
], rowEditor.prototype, "datepickerList", void 0);
rowEditor = __decorate([
    core_1.Directive({
        selector: '.row-editor',
        inputs: ['model', 'config'],
        outputs: ['rowUpdate']
    }), 
    __metadata('design:paramtypes', [core_1.ElementRef])
], rowEditor);
exports.rowEditor = rowEditor;
