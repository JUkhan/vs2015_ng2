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
var core_1 = require("@angular/core");
var ui_service_1 = require('../ui.service');
var Rx_1 = require('rxjs/Rx');
var juSelect_old = (function () {
    function juSelect_old(el, uiService) {
        this.el = el;
        this.uiService = uiService;
        this.viewMode = 'select';
        this.api = {};
        this.hideSearch = false;
        this.disabled = false;
        this.config = {};
        this.notifyRowEditor = new Rx_1.Subject();
        this.onChange = new core_1.EventEmitter();
        this.spliter = '$#$';
        this.visible = false;
        this.isAllSelected = false;
        this.slideState = 'up';
        this.eventState = { visible: false, isHeader: false };
        this.focusToValidate = false;
        this.valueChanges = new Rx_1.Subject();
    }
    juSelect_old.prototype.ngOnChanges = function (changes) {
    };
    Object.defineProperty(juSelect_old.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (val) {
            this._previousValue = this._value;
            this._value = val;
            if (val) {
                if (Array.isArray(val)) {
                    this.selectItems(val.join(this.spliter));
                }
                else {
                    this.viewMode === 'checkbox' ? this.selectItems(val) : this.selectItem(val);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(juSelect_old.prototype, "dataSrc", {
        get: function () {
            return this._dataSrc || [];
        },
        set: function (val) {
            var _this = this;
            if (!val) {
                return;
            }
            var temp = val.map(function (item) { return Object.assign({}, item, { selected: false }); });
            this.searchData = temp;
            this._dataSrc = temp;
            var _val = this._getValueByPropertyName();
            if (this.config.isFilter) {
                if (_val) {
                    async_call(function () { _this.value = _val; });
                }
                else if (val && val.length > 0) {
                    this._setValueByPropertyName(val[0].value);
                    async_call(function () { _this.value = _val; });
                }
            }
            else {
                if (_val) {
                    async_call(function () { _this.value = _val; });
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    juSelect_old.prototype._getValueByPropertyName = function () {
        var props = this.propertyName.split('.');
        if (props.length > 1) {
            var obj_1 = this.model;
            props.forEach(function (prop) { return obj_1 = obj_1[prop]; });
            return obj_1;
        }
        return this.model[this.propertyName];
    };
    juSelect_old.prototype._setValueByPropertyName = function (val) {
        var props = this.propertyName.split('.');
        if (props.length > 1) {
            var obj = this.model;
            var len = props.length - 1;
            for (var index = 0; index < len; index++) {
                obj = obj[props[index]];
            }
            obj[props[index]] = val;
        }
        else {
            this.model[this.propertyName] = val;
        }
    };
    juSelect_old.prototype.checkCssClass = function () {
        return this.viewMode === 'checkbox' ? false : this.hideSearch;
    };
    juSelect_old.prototype.ngOnInit = function () {
        var _this = this;
        this.config.api = this;
        this.viewMode = this.viewMode.toLocaleLowerCase();
        if (this.viewMode === 'select' || this.viewMode === 'radio') {
            this.selectedText = 'Select option';
        }
        else {
            this.selectedText = 'Select options';
        }
        this.api.api = this;
        var selectDiv = this.el.nativeElement.querySelector('.ju-select'), optionsDiv = this.el.nativeElement.querySelector('.options');
        this.domClickSubscription = this.uiService.documentClick.subscribe(function (event) {
            var target = event.target;
            if (jQuery(target).parents('.ju-select').length) {
                _this.eventState.visible = _this.visible;
                _this.eventState.isHeader = true;
            }
            else {
                _this.eventState.isHeader = false;
            }
            if (_this.visible && !(jQuery(target).parents('.options').length)) {
                _this.visible = false;
                _this.focusToValidate = true;
            }
            _this.animate();
        });
        this.optionsDom = jQuery(this.el.nativeElement).find('.options');
        this.optionsDom.hide();
    };
    juSelect_old.prototype.toggleOPtions = function (event) {
        event.preventDefault();
        if (this.eventState.isHeader) {
            this.visible = this.eventState.visible;
        }
        if (this.disabled) {
            this.visible = false;
        }
        else {
            this.visible = !this.visible;
        }
        if (this.config)
            this.config.hideMsg = false;
        this.animate();
    };
    juSelect_old.prototype.animate = function () {
        this.visible ? this.optionsDom.slideDown() : this.optionsDom.slideUp();
    };
    juSelect_old.prototype.ngOnDestroy = function () {
        if (!this.config.isFilter) {
            this.domClickSubscription.unsubscribe();
        }
    };
    juSelect_old.prototype.removeOption = function (option) {
        this.dataSrc.splice(this.dataSrc.indexOf(option), 1);
    };
    juSelect_old.prototype.selectOption = function (option) {
        var _this = this;
        if (this.viewMode === 'select' || this.viewMode === 'radio') {
            this.dataSrc.forEach(function (op) { return op.selected = (op === option); });
            async_call(function () { _this.visible = !_this.visible; _this.animate(); }, 100);
            this.selectedText = option.name;
        }
        else if (this.viewMode === 'checkbox') {
            option.selected = !option.selected;
            var selectedOptions = this.dataSrc.filter(function (v) { return v.selected === true; });
            if (selectedOptions) {
                this.isAllSelected = selectedOptions.length === this.dataSrc.length;
                if (this.isAllSelected) {
                    this.selectedText = 'All items selected(' + this.dataSrc.length + ')';
                }
                else {
                    if (selectedOptions.length == 0)
                        this.selectedText = 'Select options';
                    else
                        this.selectedText = selectedOptions.length + (selectedOptions.length > 1 ? ' items' : ' item') + ' selected';
                }
            }
        }
        this._setModelValue();
        this.notifyRowEditor.next({});
    };
    juSelect_old.prototype.search = function (val) {
        if (val) {
            val = val.toLowerCase();
        }
        var temp = [];
        this.dataSrc.forEach(function (item) {
            if ((item.name && item.name.toLowerCase().indexOf(val) >= 0) || (item.description && item.description.toLowerCase().indexOf(val) >= 0)) {
                temp.push(item);
            }
        });
        this.searchData = temp;
    };
    juSelect_old.prototype.selectItem = function (value_or_name) {
        var _this = this;
        if (!value_or_name)
            return;
        this.checkAll(false, false);
        var valueSelected = false;
        if (this.searchData) {
            this.searchData.forEach(function (v) {
                if (v.value.toString() === value_or_name.toString() || v.name === value_or_name) {
                    _this.selectedText = v.name;
                    var option = _this.dataSrc.find(function (x) { return x.value.toString() === v.value.toString(); });
                    if (option) {
                        option.selected = true;
                        valueSelected = true;
                    }
                }
            });
        }
        if (valueSelected) {
            this._setValueByPropertyName(this.value);
            if (this._value !== this._previousValue) {
                this.onChange.next({ value: this.value, sender: this, form: this.myForm, index: this.index });
                this.valueChanges.next({ value: this.value, sender: this, form: this.myForm, index: this.index });
            }
        }
    };
    juSelect_old.prototype.selectItems = function (values_or_names) {
        var _this = this;
        if (!values_or_names)
            return;
        this.checkAll(false, false);
        var spliter = this.spliter, len = 0;
        if (Array.isArray(values_or_names)) {
            len = values_or_names.length;
            values_or_names = values_or_names.join(spliter);
        }
        else {
            len = values_or_names.toString().split(spliter).length;
        }
        this.selectedText = len + (len > 1 ? ' items' : ' item') + ' selected';
        if (len <= 0)
            return;
        values_or_names = spliter + values_or_names + spliter;
        var valueSelected = false;
        if (this.searchData) {
            this.searchData.forEach(function (v) {
                if (values_or_names.indexOf(spliter + v.value + spliter) >= 0 || values_or_names.indexOf(spliter + v.name + spliter) >= 0) {
                    var option = _this.dataSrc.find(function (x) { return x.value === v.value; });
                    if (option) {
                        option.selected = true;
                        valueSelected = true;
                    }
                }
            });
        }
        if (valueSelected) {
            this._setValueByPropertyName(this.value);
            if (this._value !== this._previousValue) {
                this.onChange.next({ value: this.value, sender: this, form: this.myForm, index: this.index });
                this.valueChanges.next({ value: this.value, sender: this, form: this.myForm, index: this.index });
            }
        }
    };
    juSelect_old.prototype.getNames = function () {
        var res = [];
        if (!this.dataSrc)
            return '';
        if (this.dataSrc)
            this.dataSrc.forEach(function (v) {
                if (v.selected) {
                    res.push(v.name);
                }
            });
        if (Array.isArray(this._getValueByPropertyName()))
            return res;
        return res.join(this.spliter);
    };
    juSelect_old.prototype.getValues = function () {
        var res = [];
        if (!this.dataSrc)
            return '';
        if (this.dataSrc)
            this.dataSrc.forEach(function (v) {
                if (v.selected) {
                    res.push(v.value);
                }
            });
        if (Array.isArray(this._getValueByPropertyName()))
            return res;
        return res.join(this.spliter);
    };
    juSelect_old.prototype.getSelectedItems = function () {
        var res = [];
        if (!this.dataSrc)
            return res;
        if (this.dataSrc)
            this.dataSrc.forEach(function (v) {
                if (v.selected) {
                    res.push(v);
                }
            });
        return res;
    };
    juSelect_old.prototype.checkAll = function (isChecked, isModelUpdate) {
        if (isModelUpdate === void 0) { isModelUpdate = true; }
        this.dataSrc.forEach(function (v) { return v.selected = isChecked; });
        this.isAllSelected = isChecked;
        if (isChecked) {
            if (this.dataSrc.length === this.searchData.length) {
                this.selectedText = 'All items selected(' + this.dataSrc.length + ')';
            }
            else {
                this.selectedText = this.searchData.length + (this.searchData.length > 1 ? ' items' : ' item') + ' selected';
            }
        }
        else {
            this.selectedText = this.viewMode === 'checkbox' ? 'Select options' : 'Select option';
        }
        if (isModelUpdate) {
            this._setModelValue();
        }
    };
    juSelect_old.prototype.setDtaSrc = function (data) {
        this.dataSrc = data;
        this.searchData = data;
    };
    juSelect_old.prototype._setModelValue = function () {
        if (this.model && this.propertyName && this.method) {
            this._setValueByPropertyName(this.method === 'getValues' ? this.getValues() : this.getNames());
            this.onChange.next({ value: this._getValueByPropertyName(), sender: this, form: this.myForm, index: this.index });
            this.valueChanges.next({ value: this._getValueByPropertyName(), sender: this, form: this.myForm, index: this.index });
        }
    };
    juSelect_old.prototype.hasError = function () {
        var vals = this.getValues(), res;
        if (Array.isArray(vals)) {
            vals = vals.join(this.spliter);
        }
        if (this.myForm.dynamicComponent) {
            this.myForm.dynamicComponent.instance
                .vlidate_input(vals, this.config, !this.focusToValidate);
        }
        else {
            this.myForm.componentRef.instance.vlidate_input(vals, this.config, !this.focusToValidate);
        }
        return !this.config.hideMsg;
    };
    __decorate([
        core_1.Input('view-mode'), 
        __metadata('design:type', String)
    ], juSelect_old.prototype, "viewMode", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], juSelect_old.prototype, "api", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], juSelect_old.prototype, "method", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], juSelect_old.prototype, "model", void 0);
    __decorate([
        core_1.Input('property-name'), 
        __metadata('design:type', Object)
    ], juSelect_old.prototype, "propertyName", void 0);
    __decorate([
        core_1.Input('hide-search'), 
        __metadata('design:type', Boolean)
    ], juSelect_old.prototype, "hideSearch", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], juSelect_old.prototype, "disabled", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], juSelect_old.prototype, "config", void 0);
    __decorate([
        core_1.Input('myForm'), 
        __metadata('design:type', Object)
    ], juSelect_old.prototype, "myForm", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], juSelect_old.prototype, "index", void 0);
    __decorate([
        core_1.Output('option-change'), 
        __metadata('design:type', Object)
    ], juSelect_old.prototype, "onChange", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], juSelect_old.prototype, "value", null);
    __decorate([
        core_1.Input('data-src'), 
        __metadata('design:type', Array), 
        __metadata('design:paramtypes', [Array])
    ], juSelect_old.prototype, "dataSrc", null);
    juSelect_old = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'juSelect',
            encapsulation: core_1.ViewEncapsulation.None,
            changeDetection: core_1.ChangeDetectionStrategy.Default,
            animations: [
                core_1.trigger('slide', [
                    core_1.state('up', core_1.style({ opacity: 0, height: 0 })),
                    core_1.state('down', core_1.style({ opacity: 1, height: '*' })),
                    core_1.transition('up => down', [core_1.style({ height: 1 }), core_1.animate('300ms ease-in')]),
                    core_1.transition('down => up', core_1.animate('200ms ease-out'))
                ])
            ],
            template: "<div style=\"position:relative\">\n    <div class=\"ju-select form-control\" (click)=\"toggleOPtions($event)\"><span style=\"display:block;position:relative;top:3px\">{{selectedText}}</span><b style=\"right:5px;position:absolute;top:10px;color:#555;font-size:9px\">&#9660;</b></div>\n    <div  class=\"options\" [class.empty-options]=\"!searchData || searchData.length==0\">\n        <div  class=\"action\" *ngIf=\"!checkCssClass()\">\n            <div>\n                <label [hidden]=\"!(viewMode==='checkbox')\"> <input [checked]=\"isAllSelected\" (click)=\"checkAll($event.target.checked)\" type=\"checkbox\"  title=\"check all\"> Select All</label>\n                <input *ngIf=\"!hideSearch\" type=\"text\" (keyup)=\"search($event.target.value)\" placeholder=\"search item\">\n                <span *ngIf=\"viewMode==='select'\" (click)=\"checkAll(false)\" title=\"Unselect the item\" class=\"unselect\">&#10006;</span>\n            </div>\n        </div>\n        <div class=\"items\" >\n            <div class=\"option-host\" (click)=\"selectOption(item)\" *ngFor=\"let item of searchData\">\n                <div class=\"ju-option\" [class.selected]=\"item.selected\">\n                    <div class=\"header\" *ngIf=\"(viewMode==='select')\"><span class=\"title\" [innerHtml]=\"item.name\"></span><span class=\"sub-title\" *ngIf=\"item.subtitle\" [innerHtml]=\"item.subtitle\"></span></div>\n                    <div class=\"header\" *ngIf=\"(viewMode==='radio')\"><input type=\"radio\" name=\"xp0000\" [checked]=\"item.selected\"><span class=\"title\" style=\"padding-left:5px\"\n                            [innerHtml]=\"item.name\"></span><span class=\"sub-title\" *ngIf=\"item.subtitle\" [innerHtml]=\"item.subtitle\"></span></div>\n                    <div class=\"header\" *ngIf=\"(viewMode==='checkbox')\"><input type=\"checkbox\" [checked]=\"item.selected\"><span class=\"title\" style=\"padding-left:5px\" [innerHtml]=\"item.name\"></span>\n                        <span class=\"sub-title\" *ngIf=\"item.subtitle\" [innerHtml]=\"item.subtitle\"></span>\n                    </div>\n                    <div *ngIf=\"item.description\" class=\"description\" [innerHtml]=\"item.description\"></div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>"
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, ui_service_1.UiService])
    ], juSelect_old);
    return juSelect_old;
}());
exports.juSelect_old = juSelect_old;
function async_call(fx, time) {
    if (time === void 0) { time = 0; }
    var tid = setTimeout(function () {
        fx();
        clearTimeout(tid);
    }, time);
}
//# sourceMappingURL=old_juSelect.js.map