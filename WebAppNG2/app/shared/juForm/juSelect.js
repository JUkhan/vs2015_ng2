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
var juSelect = (function () {
    function juSelect(renderer) {
        this.renderer = renderer;
        this.options = {};
        this.model = {};
        this.config = {};
        this.onChange = new core_1.EventEmitter();
        this.previousValue = '';
        this.selectedItem = {};
        this.hasSerchResult = true;
        this.maxOptionsVisibility = 'hidden';
        this.focusToValidate = false;
        this.tableBodyContent = null;
        this.isEditable = false;
        this.notifyRowEditor = new Rx_1.Subject();
        this.valueChanges = new Rx_1.Subject();
    }
    Object.defineProperty(juSelect.prototype, "value", {
        set: function (val) {
            this.previousValue = val;
        },
        enumerable: true,
        configurable: true
    });
    juSelect.prototype.ngOnInit = function () {
        var _this = this;
        this.config.api = this;
        this.options.textProp = this.options.textProp || 'text';
        this.options.valueProp = this.options.valueProp || 'value';
        this.options.subTextProp = this.options.subTextProp || 'subText';
        this.options.descriptionProp = this.options.descriptionProp || 'description';
        this.options.iconProp = this.options.iconProp || 'icon';
        this.options.selectedTextProp = this.options.selectedTextProp || 'selectedText';
        this.options.disabledItemProp = this.options.disabledItemProp || 'disabled';
        this.options.styleProp = this.options.styleProp || 'style';
        this.options.title = this.options.title || '';
        this.options.maxOptions = this.options.maxOptions || 0;
        this.options.maxOptionsText = this.options.maxOptionsText || "Limit reached (" + this.options.maxOptions + " items max)";
        this.options.selectedTextFormat = this.options.selectedTextFormat || 'values';
        this.options.btnStyle = this.options.btnStyle || 'btn-default';
        this.options.width = this.options.width || '';
        this.options.height = this.options.height || 0;
        this.options.multipleSeparator = this.options.multipleSeparator || ',';
        if (!('liveSearch' in this.options)) {
            this.options.liveSearch = false;
        }
        if (!('disabled' in this.options)) {
            this.options.disabled = false;
        }
        if (!('multiselect' in this.options)) {
            this.options.multiselect = false;
        }
        if (!('dropup' in this.options)) {
            this.options.dropup = false;
        }
        if (!('fitWidth' in this.options)) {
            this.options.fitWidth = false;
        }
        if (!('showMenuArrow' in this.options)) {
            this.options.showMenuArrow = false;
        }
        if (!('editable' in this.options)) {
            this.options.showMenuArrow = false;
        }
        if (this.options.editable) {
            Rx_1.Observable.fromEvent(document.body, 'mouseup').subscribe(function (_) {
                if (_this.isEditable)
                    _this.isEditable = false;
            });
        }
    };
    juSelect.prototype.ngOnChanges = function (changes) {
        if (changes.dataList && changes.dataList.currentValue && changes.dataList.currentValue !== changes.dataList.previousValue) {
            this.dataList = changes.dataList.currentValue.map(function (item) { return Object.assign({}, item, { selected: false }); });
            this.dataList_bckup = this.dataList;
            if (this.previousValue && this.dataList && this.dataList.length > 0) {
                this.setValue(this.previousValue);
            }
        }
    };
    juSelect.prototype.setData = function (data) {
        this.dataList = data;
        if (this.previousValue) {
            this.setValue(this.previousValue);
        }
    };
    juSelect.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (this.options.liveSearch) {
            Rx_1.Observable.fromEvent(this.searchEl.nativeElement, 'keyup')
                .debounceTime(300).distinctUntilChanged()
                .map(function (e) { return e.target.value; })
                .subscribe(function (e) { return _this.liveSearch(e); });
        }
        if (this.options.editable) {
            Rx_1.Observable.fromEvent(this.editableText.nativeElement, 'keyup')
                .debounceTime(300).distinctUntilChanged()
                .map(function (e) { return e.target.value; })
                .subscribe(function (e) { return _this.setModelValue(e); });
        }
    };
    juSelect.prototype.ngOnDestroy = function () {
    };
    juSelect.prototype.setFocusToValidate = function (e) {
        this.focusToValidate = true;
        if (!this.tableBodyContent) {
            this.tableBodyContent = jQuery(this.containerEl.nativeElement).parents('.tbl-body-content');
        }
        if (this.tableBodyContent.length == 0)
            return;
        var containerOffset = this.tableBodyContent.offset();
        var containerHeight = this.tableBodyContent.height() - this.tableBodyContent.scrollTop();
        var comPos = jQuery(e.target).offset().top - containerOffset.top;
        var comHeight = jQuery(this.containerEl.nativeElement)[0].offsetHeight +
            jQuery('.dropdown-menu', this.containerEl.nativeElement).height();
        this.options.dropup = comPos + comHeight > containerHeight;
    };
    juSelect.prototype.checkAll = function (checked) {
        if (this.dataList === undefined)
            return;
        this.dataList.forEach(function (_) { return _.selected = checked; });
        this.setModelValue(checked ? this.getValue() : '');
    };
    juSelect.prototype.liveSearch = function (val) {
        var _this = this;
        this.livesearchText = val;
        if (!val) {
            this.dataList = this.dataList_bckup;
            return;
        }
        val = val.toLowerCase();
        this.dataList = this.dataList_bckup.filter(function (_) { return _[_this.options.textProp].toLowerCase().indexOf(val) != -1; });
        this.hasSerchResult = this.dataList.length > 0;
    };
    juSelect.prototype.getText = function (list) {
        var _this = this;
        return list.map(function (_) { return _[_this.options.selectedTextProp] || _[_this.options.textProp]; }).join(', ') || this.options.title;
    };
    juSelect.prototype.getFormatedText = function () {
        if (this.options.multiselect) {
            if (!this.dataList)
                return this.options.title;
            var slist = this.dataList.filter(function (_) { return _.selected; });
            if (slist.length == 0)
                return this.options.title;
            if (this.options.selectedTextFormat === 'values')
                return this.getText(slist);
            else if (this.options.selectedTextFormat === 'count') {
                if (slist.length == 1)
                    return this.getText(slist);
                return slist.length + ' items selected';
            }
            else if (this.options.selectedTextFormat.indexOf('>') >= 5) {
                var count = parseInt(this.options.selectedTextFormat.split('>')[1].trim());
                if (count >= slist.length)
                    return this.getText(slist);
                return slist.length + ' items selected';
            }
        }
        return (this.selectedItem[this.options.selectedTextProp]
            || this.selectedItem[this.options.textProp]) || this.options.title;
    };
    juSelect.prototype.getItemClasses = function (item) {
        return { selected: item.selected, disabled: item[this.options.disabledItemProp], 'single-silected': !this.options.multiselect && item.selected };
    };
    juSelect.prototype.selectItem = function (item, e) {
        var _this = this;
        this.isEditable = false;
        if (this.options.multiselect) {
            e.stopPropagation();
            item.selected = !item.selected;
            if (this.options.maxOptions > 0) {
                var slist = this.dataList.filter(function (_) { return _.selected; });
                if (slist.length > this.options.maxOptions) {
                    item.selected = false;
                    this.maxOptionsVisibility = 'visible';
                    var tid_1 = setTimeout(function () { _this.maxOptionsVisibility = 'hidden'; clearTimeout(tid_1); }, 1500);
                    return false;
                }
            }
            this.setModelValue(this.getValue());
            return false;
        }
        if (!!item[this.options.disabledItemProp])
            return;
        item.selected = true;
        if (item !== this.selectedItem && this.selectedItem.selected) {
            this.selectedItem.selected = false;
        }
        this.selectedItem = item;
        this.setModelValue(item[this.options.valueProp]);
    };
    juSelect.prototype.getBtnStyle = function () {
        return (_a = {}, _a[this.options.btnStyle] = true, _a);
        var _a;
    };
    juSelect.prototype.getDropdownStyle = function () {
        return { 'dropup': this.options.dropup, 'form-control': this.options.fitWidth || this.options.width, 'fit-width': this.options.fitWidth, 'show-menu-arrow': this.options.showMenuArrow, 'show-tick': this.options.multiselect };
    };
    juSelect.prototype.getSelectedIconStyle = function () {
        if (this.options.multiselect)
            return '';
        return this.selectedItem[this.options.textProp] ? this.getIconStyle(this.selectedItem) : '';
    };
    juSelect.prototype.getIconStyle = function (item) {
        return this.options.iconRenderer ? this.options.iconRenderer(item) :
            item[this.options.iconProp] ? 'glyphicon glyphicon-' + item[this.options.iconProp] : '';
    };
    juSelect.prototype.setValue = function (value) {
        var _this = this;
        if (this.options.editable && this.editableText)
            this.editableText.nativeElement.value = '';
        this.previousValue = value;
        this.checkAll(false);
        this.selectedItem = {};
        if (!this.dataList)
            return;
        if (!value) {
            this.setModelValue('');
            this.focusToValidate = false;
            return;
        }
        if (this.options.multiselect) {
            if (this.dataList && this.dataList.length == 0)
                return;
            value.toString().split(this.options.multipleSeparator).forEach(function (val) {
                var item = _this.dataList.find(function (_) { return _[_this.options.valueProp].toString() === val; });
                if (item)
                    item.selected = true;
            });
        }
        else {
            var item = this.dataList.find(function (_) { return _[_this.options.valueProp].toString() === value.toString(); });
            if (item) {
                item.selected = true;
                this.selectedItem = item;
            }
        }
        this.setModelValue(value);
    };
    juSelect.prototype.getValue = function () {
        var _this = this;
        if (this.options.editable && this.editableText)
            return this.editableText.nativeElement.value;
        if (this.dataList === undefined)
            return '';
        return this.dataList.filter(function (_) { return _.selected; }).map(function (_) { return _[_this.options.valueProp]; }).join(this.options.multipleSeparator);
    };
    juSelect.prototype.getValueFromModel = function () {
        var props = this.propertyName.split('.');
        if (props.length > 1) {
            var obj_1 = this.model;
            props.forEach(function (prop) { return obj_1 = obj_1[prop]; });
            return obj_1;
        }
        return this.model[this.propertyName];
    };
    juSelect.prototype.setModelValue = function (val) {
        if (!this.propertyName)
            return;
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
        if (val !== this.previousValue && val) {
            this.notifyRowEditor.next({});
            this.onChange.next({ value: val, sender: this, form: this.myForm, index: this.index });
            this.valueChanges.next({ value: val, sender: this, form: this.myForm, index: this.index });
        }
        this.previousValue = val;
    };
    juSelect.prototype.hasError = function () {
        this.myForm.componentRef.instance.vlidate_input(this.getValue(), this.config, !this.focusToValidate);
        return !this.config.hideMsg;
    };
    __decorate([
        core_1.Input('data'), 
        __metadata('design:type', Array)
    ], juSelect.prototype, "dataList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], juSelect.prototype, "options", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], juSelect.prototype, "model", void 0);
    __decorate([
        core_1.Input('property-name'), 
        __metadata('design:type', Object)
    ], juSelect.prototype, "propertyName", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], juSelect.prototype, "config", void 0);
    __decorate([
        core_1.Input('myForm'), 
        __metadata('design:type', Object)
    ], juSelect.prototype, "myForm", void 0);
    __decorate([
        core_1.Output('option-change'), 
        __metadata('design:type', Object)
    ], juSelect.prototype, "onChange", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], juSelect.prototype, "index", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], juSelect.prototype, "value", null);
    __decorate([
        core_1.ViewChild('searchEl'), 
        __metadata('design:type', core_1.ElementRef)
    ], juSelect.prototype, "searchEl", void 0);
    __decorate([
        core_1.ViewChild('maincontent'), 
        __metadata('design:type', core_1.ElementRef)
    ], juSelect.prototype, "containerEl", void 0);
    __decorate([
        core_1.ViewChild('editableText'), 
        __metadata('design:type', core_1.ElementRef)
    ], juSelect.prototype, "editableText", void 0);
    juSelect = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'juSelect, .juSelect, [juSelect]',
            encapsulation: core_1.ViewEncapsulation.None,
            changeDetection: core_1.ChangeDetectionStrategy.Default,
            template: "\n    <div #maincontent [class.open]=\"isEditable\" [ngClass]=\"getDropdownStyle()\" class=\"btn-group bootstrap-select\" [style.width]=\"options.width\">\n        <button *ngIf=\"!options.editable\" [disabled]=\"options.disabled\" type=\"button\" [ngClass]=\"getBtnStyle()\" class=\"btn dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" [title]=\"getFormatedText()\" aria-expanded=\"false\" (click)=\"setFocusToValidate($event)\">\n            <span class=\"filter-option pull-left\"> \n                <i *ngIf=\"selectedItem[options.iconProp]||options.iconRenderer\" [class]=\"getSelectedIconStyle()\"></i>               \n                <span class=\"{{options.multiselect?'':selectedItem[options.styleProp]}}\">{{getFormatedText()}}</span>\n            </span>&nbsp;\n            <span class=\"bs-caret\">\n                <span class=\"caret\"></span>\n            </span>\n        </button>\n        <div class=\"input-group\" [style.width]=\"options.width\" *ngIf=\"options.editable\">\n          <input type=\"text\" #editableText class=\"form-control\" value=\"{{getFormatedText()}}\">\n          <span class=\"input-group-btn\">\n                <button (click)=\"isEditable=!isEditable\" class=\"btn btn-default\" type=\"button\"><span class=\"caret\"></span></button>\n          </span>\n        </div>\n        <div class=\"dropdown-menu open\" role=\"combobox\" [style.max-height.px]=\"options.height?options.height:'none'\" style=\"overflow: hidden; min-height: 0px;\">            \n            <div class=\"search-checkall\" *ngIf=\"options.liveSearch||(options.multiselect && options.checkAll)\">\n                <label (click)=\"$event.stopPropagation()\" *ngIf=\"options.checkAll\"><input (click)=\"checkAll(chkAll.checked)\" #chkAll type=\"checkbox\">Select All</label>\n                <input #searchEl *ngIf=\"options.liveSearch\" [style.width.%]=\"options.checkAll?50:100\" autofocus type=\"text\" class=\"form-control\" role=\"textbox\" placeholder=\"Search...\">\n            </div>\n            <ul class=\"dropdown-menu inner\" role=\"listbox\" aria-expanded=\"false\" [style.max-height.px]=\"options.height?options.height-46:'none'\" style=\"overflow-y: auto; min-height: 0px;\" >\n                <li [ngClass]=\"getItemClasses(item)\" *ngFor=\"let item of dataList\">\n                    <a role=\"option\" (click)=\"selectItem(item, $event)\" role=\"option\">\n                        <span *ngIf=\"item[options.iconProp]||options.iconRenderer\" [class]=\"getIconStyle(item)\"></span>\n                        <span class=\"{{item[options.styleProp]||'text'}}\">{{item[options.textProp]}}<small class=\"text-muted\">{{item[options.subTextProp]}}</small>\n                        <div *ngIf=\"item[options.descriptionProp]\"><small class=\"text-muted\">{{item[options.descriptionProp]}}</small></div>\n                        </span>\n                        <span class=\"glyphicon glyphicon-ok check-mark\"></span>\n                    </a>\n                </li> \n                <li *ngIf=\"!hasSerchResult\" class=\"no-results\" style=\"display: list-item;\">\n                    No results matched \"{{livesearchText}}\"\n                </li>                         \n            </ul>\n            <div [style.visibility]=\"maxOptionsVisibility\" class=\"notify\">{{options.maxOptionsText}}</div>\n        </div>\n\n    </div>"
        }), 
        __metadata('design:paramtypes', [core_1.Renderer])
    ], juSelect);
    return juSelect;
}());
exports.juSelect = juSelect;
//# sourceMappingURL=juSelect.js.map