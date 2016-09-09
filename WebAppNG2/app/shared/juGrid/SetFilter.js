"use strict";
var Rx_1 = require('rxjs/Rx');
var SetFilter = (function () {
    function SetFilter() {
        this._isActive = false;
        this.searchCategory = '';
        this.subsList = [];
        this.chkSubscriptionList = [];
    }
    Object.defineProperty(SetFilter.prototype, "searchText", {
        get: function () {
            return this.selectedItems.join('$$$');
        },
        enumerable: true,
        configurable: true
    });
    SetFilter.prototype.init = function (params) {
        this._col = params;
        this.setupGui();
    };
    SetFilter.prototype.getGui = function () {
        return this._gui;
    };
    SetFilter.prototype.isFilterActive = function () {
        return this._isActive;
    };
    SetFilter.prototype.doesFilterPass = function (params) {
        var passed = true, colValue = params.valueGetter(params) || '';
        if (this.selectedItems.indexOf(colValue.toString()) < 0) {
            passed = false;
        }
        return passed;
    };
    SetFilter.prototype.destroy = function () {
        this.unsubscribeCkhList();
        this.subsList.forEach(function (_) {
            if (_ && !_.isUnsubscribed) {
                _.unsubscribe();
                _.remove(_);
            }
        });
    };
    SetFilter.prototype.setupGui = function () {
        var _this = this;
        this._gui = document.createElement('div');
        this._gui.style.minWidth = '200px';
        this._gui.style.minHeight = '200px';
        this._gui.innerHTML = this.getContent();
        this.subsList.push(Rx_1.Observable.fromEvent(this._gui.querySelector('#txtSearch'), 'keyup')
            .map(function (e) { return e.target.value.toLowerCase(); })
            .subscribe(function (val) {
            _this.updateItems(_this.getData().filter(function (it) { return it.toLowerCase().indexOf(val) >= 0; }));
        }));
        this.subsList.push(Rx_1.Observable.fromEvent(this._gui.querySelector('#selectAll'), 'click')
            .map(function (e) { return e.target.checked; })
            .subscribe(function (val) {
            _this._isActive = true;
            _this.checkAll(val);
            _this.doFilter();
            _this._isActive = !val;
        }));
        if (this._col.params.value) {
            this.bindData(this._col.params.value);
        }
    };
    SetFilter.prototype.updateItems = function (list) {
        var items = this._gui.querySelectorAll('.set-content .item');
        for (var i = 0; i < items.length; i++) {
            items[i].className = list.indexOf(items[i].querySelector('input.chk').value) >= 0
                ? 'item' : 'item icon-hide';
        }
    };
    SetFilter.prototype.doFilter = function () {
        this.selectedItems = this.getList(function (it) { return it.checked; });
        this._col.filterChangedCallback();
    };
    SetFilter.prototype.checkAll = function (checkedFlag) {
        var matches = this._gui.querySelectorAll('.set-content  input.chk');
        for (var index = 0; index < matches.length; index++) {
            matches[index].checked = checkedFlag;
        }
    };
    SetFilter.prototype.getList = function (ex) {
        var matches = this._gui.querySelectorAll('.set-content  input.chk'), res = [];
        for (var index = 0; index < matches.length; index++) {
            if (ex(matches[index])) {
                res.push(matches[index].value);
            }
        }
        return res;
    };
    SetFilter.prototype.getData = function () {
        return (this.data || this._col.params.value);
    };
    SetFilter.prototype.getContent = function () {
        var tpl = [];
        tpl.push('<div style="padding:5px"><input id="txtSearch" placeholder="Search..." type="text"></div>');
        tpl.push('<div class="select-all"><label><input id="selectAll" checked type="checkbox"> (Select All)</label></div>');
        tpl.push('<div class="set-content">');
        tpl.push('</div>');
        return tpl.join('');
    };
    SetFilter.prototype.unsubscribeCkhList = function () {
        this.chkSubscriptionList.forEach(function (it) {
            if (it && !it.isUnsubscribed) {
                it.unsubscribe();
                it.remove(it);
            }
        });
    };
    SetFilter.prototype.removeItems = function () {
        var items = this._gui.querySelectorAll('.set-content .item');
        for (var i = 0; i < items.length; i++) {
            items[i].remove();
        }
    };
    SetFilter.prototype.bindData = function (data) {
        var _this = this;
        this.unsubscribeCkhList();
        var tpl = [], uncheckedList = this.getList(function (it) { return it.checked === false; });
        this.removeItems();
        data.forEach(function (it, index) {
            tpl.push('<div class="item">');
            if (_this._col.params.cellRenderer) {
                tpl.push("<label><input class=\"chk\" " + (uncheckedList.indexOf(it) < 0 ? 'checked' : '') + " type=\"checkbox\" value=\"" + it + "\"> " + _this._col.params.cellRenderer(it, index) + "</label>");
            }
            else {
                tpl.push("<label><input class=\"chk\" " + (uncheckedList.indexOf(it) < 0 ? 'checked' : '') + " type=\"checkbox\" value=\"" + it + "\"> " + it + "</label>");
            }
            tpl.push('</div>');
        });
        this._gui.querySelector('.set-content').innerHTML = tpl.join('');
        var chkList = this._gui.querySelectorAll('.set-content input.chk'), chkAll = this._gui.querySelector('#selectAll');
        for (var i = 0; i < chkList.length; i++) {
            this.chkSubscriptionList.push(Rx_1.Observable.fromEvent(chkList[i], 'click').subscribe(function (next) {
                _this._isActive = true;
                var ischecked = _this.getList(function (it) { return it.checked === true; }).length === _this.getData().length;
                chkAll.checked = ischecked;
                _this.doFilter();
                _this._isActive = !ischecked;
            }));
        }
    };
    return SetFilter;
}());
exports.SetFilter = SetFilter;
//# sourceMappingURL=SetFilter.js.map