"use strict";
var Rx_1 = require('rxjs/Rx');
var TextFilter = (function () {
    function TextFilter() {
        this._isActive = false;
        this._isApply = false;
        this.searchCategory = 'Contains';
        this.searchText = '';
        this.subsList = [];
    }
    TextFilter.prototype.init = function (params) {
        this.setupGui(params);
    };
    TextFilter.prototype.getGui = function () {
        return this._gui;
    };
    TextFilter.prototype.isFilterActive = function () {
        return this._isActive;
    };
    TextFilter.prototype.doesFilterPass = function (params) {
        var passed = true, colValue = params.valueGetter(params).toLowerCase();
        if (this.searchText) {
            switch (this.searchCategory) {
                case 'Contains':
                    passed = colValue.indexOf(this.searchText) >= 0;
                    break;
                case 'Equals':
                    passed = colValue === this.searchText;
                    break;
                case 'Not equals':
                    passed = colValue !== this.searchText;
                    break;
                case 'Starts with':
                    passed = colValue.startsWith(this.searchText);
                    break;
                case 'Ends with':
                    passed = colValue.endsWith(this.searchText);
                    break;
                default:
                    break;
            }
        }
        return passed;
    };
    TextFilter.prototype.destroy = function () {
        this.subsList.forEach(function (_) {
            _.unsubscribe();
            _.remove(_);
        });
    };
    TextFilter.prototype.setupGui = function (params) {
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
            .map(function (e) { return e.target.value.toLowerCase(); })
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
    TextFilter.prototype.getContent = function () {
        var tpl = [];
        tpl.push('<div style="padding:5px">');
        tpl.push('<div>');
        tpl.push("<select id=\"ddlFilter\" style=\"display:inline-block;width:120px\">\n            <option value=\"Contains\">Contains</option>\n            <option value=\"Equals\">Equals</option>\n            <option value=\"Not equals\">Not equals</option>\n            <option value=\"Starts with\">Starts with</option>\n            <option value=\"Ends with\">Ends with</option>            \n       </select>");
        tpl.push('</div>');
        tpl.push('<div style="padding-top:3px"><input id="txtFilter" placeholder="Filter..." type="text"></div>');
        if (this._isApply) {
            tpl.push('<div style="padding-top:3px;text-align:center;"><input id="applyButton" type="button" value="Apply"></div>');
        }
        tpl.push('</div>');
        return tpl.join('');
    };
    return TextFilter;
}());
exports.TextFilter = TextFilter;
//# sourceMappingURL=TextFilter.js.map