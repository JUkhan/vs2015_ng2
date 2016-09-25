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
var juSelectNew = (function () {
    function juSelectNew(renderer) {
        this.renderer = renderer;
        this.options = {};
        this.selectedItem = {};
        this.hasSerchResult = true;
        this.maxOptionsVisibility = 'hidden';
    }
    juSelectNew.prototype.ngOnInit = function () {
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
    };
    juSelectNew.prototype.ngOnChanges = function (changes) {
        if (this.options.liveSearch)
            this.dataList_bckup = this.dataList.slice(0);
    };
    juSelectNew.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (this.options.liveSearch) {
            Rx_1.Observable.fromEvent(this.searchEl.nativeElement, 'keyup')
                .debounceTime(300).distinctUntilChanged()
                .map(function (e) { return e.target.value; })
                .subscribe(function (e) { return _this.liveSearch(e); });
        }
    };
    juSelectNew.prototype.ngOnDestroy = function () {
    };
    juSelectNew.prototype.liveSearch = function (val) {
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
    juSelectNew.prototype.getText = function (list) {
        var _this = this;
        return list.map(function (_) { return _[_this.options.selectedTextProp] || _[_this.options.textProp]; }).join(', ') || this.options.title;
    };
    juSelectNew.prototype.getFormatedText = function () {
        if (this.options.multiselect) {
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
    juSelectNew.prototype.getItemClasses = function (item) {
        return { selected: item.selected, disabled: item[this.options.disabledItemProp], 'single-silected': !this.options.multiselect && item.selected };
    };
    juSelectNew.prototype.selectItem = function (item, e) {
        var _this = this;
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
            return false;
        }
        if (!!item[this.options.disabledItemProp])
            return;
        item.selected = true;
        if (item !== this.selectedItem && this.selectedItem.selected) {
            this.selectedItem.selected = false;
        }
        this.selectedItem = item;
    };
    juSelectNew.prototype.getBtnStyle = function () {
        return (_a = {}, _a[this.options.btnStyle] = true, _a);
        var _a;
    };
    juSelectNew.prototype.getDropdownStyle = function () {
        return { 'dropup': this.options.dropup, 'form-control': this.options.fitWidth || this.options.width, 'fit-width': this.options.fitWidth, 'show-menu-arrow': this.options.showMenuArrow, 'show-tick': this.options.multiselect };
    };
    juSelectNew.prototype.getSelectedIconStyle = function () {
        if (this.options.multiselect)
            return '';
        return this.selectedItem[this.options.textProp] ? this.getIconStyle(this.selectedItem) : '';
    };
    juSelectNew.prototype.getIconStyle = function (item) {
        return this.options.iconRenderer ? this.options.iconRenderer(item) :
            item[this.options.iconProp] ? 'glyphicon glyphicon-' + item[this.options.iconProp] : '';
    };
    __decorate([
        core_1.Input('data'), 
        __metadata('design:type', Array)
    ], juSelectNew.prototype, "dataList", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], juSelectNew.prototype, "options", void 0);
    __decorate([
        core_1.ViewChild('searchEl'), 
        __metadata('design:type', core_1.ElementRef)
    ], juSelectNew.prototype, "searchEl", void 0);
    juSelectNew = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'juSelectNew, .juSelectNew, [juSelectNew]',
            encapsulation: core_1.ViewEncapsulation.None,
            changeDetection: core_1.ChangeDetectionStrategy.Default,
            template: "\n    <div [ngClass]=\"getDropdownStyle()\" class=\"btn-group bootstrap-select\" [style.width]=\"options.width\">\n        <button [disabled]=\"options.disabled\" type=\"button\" [ngClass]=\"getBtnStyle()\" class=\"btn dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" [title]=\"getFormatedText()\" aria-expanded=\"false\" >\n            <span class=\"filter-option pull-left\"> \n                <i *ngIf=\"selectedItem[options.iconProp]||options.iconRenderer\" [class]=\"getSelectedIconStyle()\"></i>               \n                <span class=\"{{options.multiselect?'':selectedItem[options.styleProp]}}\">{{getFormatedText()}}</span>\n            </span>&nbsp;\n            <span class=\"bs-caret\">\n                <span class=\"caret\"></span>\n            </span>\n        </button>\n        <div class=\"dropdown-menu open\" role=\"combobox\" [style.max-height.px]=\"options.height?options.height:'none'\" style=\"overflow: hidden; min-height: 0px;\">            \n            <div class=\"search-checkall\" *ngIf=\"options.liveSearch||(options.multiselect && options.checkAll)\">\n                <label *ngIf=\"options.checkAll\"><input type=\"checkbox\">Select All</label>\n                <input #searchEl *ngIf=\"options.liveSearch\" [style.width.%]=\"options.checkAll?50:100\" autofocus type=\"text\" class=\"form-control\" role=\"textbox\" placeholder=\"Search...\">\n            </div>\n            <ul class=\"dropdown-menu inner\" role=\"listbox\" aria-expanded=\"false\" [style.max-height.px]=\"options.height?options.height-46:'none'\" style=\"overflow-y: auto; min-height: 0px;\" >\n                <li [ngClass]=\"getItemClasses(item)\" *ngFor=\"let item of dataList\">\n                    <a role=\"option\" (click)=\"selectItem(item, $event)\" role=\"option\">\n                        <span *ngIf=\"item[options.iconProp]||options.iconRenderer\" [class]=\"getIconStyle(item)\"></span>\n                        <span class=\"{{item[options.styleProp]||'text'}}\">{{item[options.textProp]}}<small class=\"text-muted\">{{item[options.subTextProp]}}</small>\n                        <div *ngIf=\"item[options.descriptionProp]\"><small class=\"text-muted\">{{item[options.descriptionProp]}}</small></div>\n                        </span>\n                        <span class=\"glyphicon glyphicon-ok check-mark\"></span>\n                    </a>\n                </li> \n                <li *ngIf=\"!hasSerchResult\" class=\"no-results\" style=\"display: list-item;\">\n                    No results matched \"{{livesearchText}}\"\n                </li>                         \n            </ul>\n            <div [style.visibility]=\"maxOptionsVisibility\" class=\"notify\">{{options.maxOptionsText}}</div>\n        </div>\n\n    </div>"
        }), 
        __metadata('design:paramtypes', [core_1.Renderer])
    ], juSelectNew);
    return juSelectNew;
}());
exports.juSelectNew = juSelectNew;
//# sourceMappingURL=juSelectNew.js.map