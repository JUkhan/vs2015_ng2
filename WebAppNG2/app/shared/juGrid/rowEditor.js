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
var juSelect_1 = require('../juForm/juSelect');
var Datetimepicker_1 = require('../juForm/Datetimepicker');
var Rx_1 = require('rxjs/Rx');
var rowEditor = (function () {
    function rowEditor(el) {
        this.el = el;
        this.isUpdated = false;
        this.subsList = [];
        this.validationMsg = {};
    }
    rowEditor.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.eventBinding(this.el.nativeElement.querySelectorAll('.select'), 'change');
        this.eventBinding(this.el.nativeElement.querySelectorAll('.text'), 'change');
        this.juSelectList.toArray().forEach(function (_) {
            _this.subsList.push(_.notifyRowEditor.subscribe(function () { _this.isUpdated = true; }));
        });
        this.datepickerList.toArray().forEach(function (_) {
            _this.subsList.push(_.notifyRowEditor.subscribe(function () { _this.isUpdated = true; }));
        });
    };
    rowEditor.prototype.ngOnInit = function () {
    };
    rowEditor.prototype.ngOnDestroy = function () {
        this.subsList.forEach(function (_) {
            if (!_.isUnsubscribed) {
                _.unsubscribe();
                _.remove(_);
            }
        });
    };
    rowEditor.prototype.isValid = function (fieldName) {
        var def = this.config.columnDefs.find(function (_) { return _.field === fieldName; }), res = true;
        if (def) {
            res = this.validate_input(this.model[fieldName], fieldName, def);
        }
        return { 'validation-msg-show': !res, 'validation-msg-hide': res };
    };
    rowEditor.prototype.getValidationMsg = function (fieldName) {
        return this.validationMsg[fieldName];
    };
    rowEditor.prototype.setJuSelectData = function (key, value) {
        try {
            this.juSelectList.toArray().find(function (_) { return _.propertyName === key; }).dataSrc = value;
        }
        catch (er) {
            console.error("Did not find the field name '" + key + "'");
        }
    };
    rowEditor.prototype.eventBinding = function (list, eventName) {
        var _this = this;
        for (var i = 0; i < list.length; i++) {
            this.subsList.push(Rx_1.Observable.fromEvent(list[i], eventName).subscribe(function (e) {
                _this.isUpdated = true;
            }));
        }
    };
    rowEditor.prototype.validate_input = function (val, field, def) {
        var res = true;
        if (def.validators) {
            if (Array.isArray(def.validators) && def.validators.length > 0) {
                var len = def.validators.length, i = 0;
                while (i < len && (res = this.validate_input_helper(val, field, def.validators[i]))) {
                    i++;
                }
            }
            else if (typeof def.validators === 'function') {
                res = this.validate_input_helper(val, field, def.validators);
            }
        }
        return res;
    };
    rowEditor.prototype.validate_input_helper = function (val, field, fx) {
        var msg = fx(val, field);
        if (typeof msg === 'string') {
            this.validationMsg[field] = msg;
            return false;
        }
        return true;
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
    return rowEditor;
}());
exports.rowEditor = rowEditor;
//# sourceMappingURL=rowEditor.js.map