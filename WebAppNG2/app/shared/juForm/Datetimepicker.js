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
var Rx_1 = require('rxjs/Rx');
var Datetimepicker = (function () {
    function Datetimepicker(el) {
        this.el = el;
        this.pickers = {};
        this.pickerName = '';
        this.model = {};
        this.notifyRowEditor = new Rx_1.Subject();
    }
    Datetimepicker.prototype.ngOnInit = function () {
        var _this = this;
        switch (this.pickerName) {
            case 'datepicker':
                this.pickerObject = jQuery(this.el.nativeElement).datepicker(this.pickers);
                this.pickerObject.on('changeDate', function (e) {
                    if (_this.property.indexOf('.') !== -1) {
                        var arr = _this.property.split('.'), len = arr.length - 1, obj = _this.model;
                        for (var i = 0; i < len; i++) {
                            obj = obj[arr[i]];
                        }
                        obj[arr[i]] = e.format();
                    }
                    else {
                        _this.model[_this.property] = e.format();
                    }
                    if (_this.form) {
                        _this.form.dynamicComponent.instance
                            .vlidate_input(e.format(), _this.config);
                    }
                    _this.notifyRowEditor.next(e.format());
                });
                break;
            case 'timepicker':
                jQuery(this.el.nativeElement).timepicker(this.pickers);
                break;
            case 'colorpicker':
                jQuery(this.el.nativeElement).colorpicker(this.pickers);
                break;
        }
        this.config.api = this;
    };
    Datetimepicker.prototype.setDate = function (date) {
        this.pickerObject.datepicker('update', date);
        this.notifyRowEditor.next(date);
    };
    Datetimepicker.prototype.ngOnDestroy = function () {
        if (this.pickerName === 'datepicker') {
            this.pickerObject.datepicker('destroy');
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Datetimepicker.prototype, "pickers", void 0);
    __decorate([
        core_1.Input('picker-name'), 
        __metadata('design:type', String)
    ], Datetimepicker.prototype, "pickerName", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Datetimepicker.prototype, "model", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Datetimepicker.prototype, "property", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Datetimepicker.prototype, "config", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Datetimepicker.prototype, "form", void 0);
    Datetimepicker = __decorate([
        core_1.Directive({
            selector: '[pickers]'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], Datetimepicker);
    return Datetimepicker;
}());
exports.Datetimepicker = Datetimepicker;
//# sourceMappingURL=Datetimepicker.js.map