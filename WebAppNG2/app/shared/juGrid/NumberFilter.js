"use strict";
var Rx_1 = require('rxjs/Rx');
var NumberFilter = (function () {
    function NumberFilter() {
        this._isActive = false;
        this._isApply = false;
        this.searchCategory = '=';
        this.searchText = '';
        this.subsList = [];
    }
    NumberFilter.prototype.init = function (params) {
        this.setupGui(params);
    };
    NumberFilter.prototype.getGui = function () {
        return this._gui;
    };
    NumberFilter.prototype.isFilterActive = function () {
        return this._isActive;
    };
    NumberFilter.prototype.doesFilterPass = function (params) {
        var passed = true, colValue = +params.valueGetter(params);
        if (this.searchText) {
            switch (this.searchCategory) {
                case '=':
                    passed = colValue == +this.searchText;
                    break;
                case '!=':
                    passed = colValue != +this.searchText;
                    break;
                case '<':
                    passed = colValue < +this.searchText;
                    break;
                case '<=':
                    passed = colValue <= +this.searchText;
                    break;
                case '>':
                    passed = colValue > +this.searchText;
                    break;
                case '>=':
                    passed = colValue >= +this.searchText;
                    break;
                default:
                    break;
            }
        }
        return passed;
    };
    NumberFilter.prototype.destroy = function () {
        this.subsList.forEach(function (_) {
            _.unsubscribe();
            _.remove(_);
        });
    };
    NumberFilter.prototype.setupGui = function (params) {
        var _this = this;
        if (params.params && params.params.apply) {
            this._isApply = params.params.apply;
        }
        this._gui = document.createElement('div');
        this._gui.style.minWidth = '200px';
        this._gui.innerHTML = this.getContent();
        this.subsList.push(Rx_1.Observable.fromEvent(this._gui.querySelector('#ddlFilter'), 'change')
            .map(function (e) { return e.target.value; })
            .subscribe(function (val) {
            _this.searchCategory = val;
            if (!_this._isApply && _this.searchText) {
                params.filterChangedCallback();
            }
        }));
        this.subsList.push(Rx_1.Observable.fromEvent(this._gui.querySelector('#txtFilter'), 'keyup')
            .distinctUntilChanged()
            .debounceTime(300)
            .map(function (e) { return e.target.value; })
            .subscribe(function (val) {
            _this.searchText = val;
            _this._isActive = val ? true : false;
            if (!_this._isApply) {
                params.filterChangedCallback();
            }
        }));
        if (this._isApply) {
            this.subsList.push(Rx_1.Observable.fromEvent(this._gui.querySelector('#applyButton'), 'click')
                .subscribe(function (val) {
                params.filterChangedCallback();
            }));
        }
    };
    NumberFilter.prototype.getContent = function () {
        var tpl = [];
        tpl.push('<div style="padding:5px">');
        tpl.push('<div>');
        tpl.push("<select id=\"ddlFilter\" style=\"display:inline-block;width:120px\">\n            <option value=\"=\">Equals</option>\n            <option value=\"!=\">Not equals</option>\n            <option value=\"<\">Less than</option>\n            <option value=\"<=\">Less than or equal</option>\n            <option value=\">\">Greater than</option>\n            <option value=\">=\">Greater than or equal</option>         \n       </select>");
        tpl.push('</div>');
        tpl.push('<div style="padding-top:3px"><input id="txtFilter" placeholder="Filter..." type="number"></div>');
        if (this._isApply) {
            tpl.push('<div style="padding-top:3px;text-align:center;"><input id="applyButton" type="button" value="Apply"></div>');
        }
        tpl.push('</div>');
        return tpl.join('');
    };
    return NumberFilter;
}());
exports.NumberFilter = NumberFilter;
//# sourceMappingURL=NumberFilter.js.map