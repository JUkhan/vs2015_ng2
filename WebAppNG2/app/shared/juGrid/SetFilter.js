"use strict";
const Rx_1 = require('rxjs/Rx');
class SetFilter {
    constructor() {
        this._isActive = false;
        this.searchCategory = '';
        this.subsList = [];
        this.chkSubscriptionList = [];
    }
    get searchText() {
        return this.selectedItems.join('$$$');
    }
    init(params) {
        this._col = params;
        this.setupGui();
    }
    getGui() {
        return this._gui;
    }
    isFilterActive() {
        return this._isActive;
    }
    doesFilterPass(params) {
        let passed = true, colValue = params.valueGetter(params) || '';
        if (this.selectedItems.indexOf(colValue.toString()) < 0) {
            passed = false;
        }
        return passed;
    }
    destroy() {
        this.unsubscribeCkhList();
        this.subsList.forEach(_ => {
            _.unsubscribe();
            _.remove(_);
        });
    }
    setupGui() {
        this._gui = document.createElement('div');
        this._gui.style.minWidth = '200px';
        this._gui.style.minHeight = '200px';
        this._gui.innerHTML = this.getContent();
        this.subsList.push(Rx_1.Observable.fromEvent(this._gui.querySelector('#txtSearch'), 'keyup')
            .map((e) => e.target.value.toLowerCase())
            .subscribe(val => {
            this.updateItems(this.getData().filter((it) => it.toLowerCase().indexOf(val) >= 0));
        }));
        this.subsList.push(Rx_1.Observable.fromEvent(this._gui.querySelector('#selectAll'), 'click')
            .map((e) => e.target.checked)
            .subscribe(val => {
            this._isActive = true;
            this.checkAll(val);
            this.doFilter();
            this._isActive = !val;
        }));
        if (this._col.params.value) {
            this.bindData(this._col.params.value);
        }
    }
    updateItems(list) {
        let items = this._gui.querySelectorAll('.set-content .item');
        for (var i = 0; i < items.length; i++) {
            items[i].className = list.indexOf(items[i].querySelector('input.chk').value) >= 0
                ? 'item' : 'item icon-hide';
        }
    }
    doFilter() {
        this.selectedItems = this.getList(it => it.checked);
        this._col.filterChangedCallback();
    }
    checkAll(checkedFlag) {
        let matches = this._gui.querySelectorAll('.set-content  input.chk');
        for (var index = 0; index < matches.length; index++) {
            matches[index].checked = checkedFlag;
        }
    }
    getList(ex) {
        let matches = this._gui.querySelectorAll('.set-content  input.chk'), res = [];
        for (var index = 0; index < matches.length; index++) {
            if (ex(matches[index])) {
                res.push(matches[index].value);
            }
        }
        return res;
    }
    getData() {
        return (this.data || this._col.params.value);
    }
    getContent() {
        let tpl = [];
        tpl.push('<div style="padding:5px"><input id="txtSearch" placeholder="Search..." type="text"></div>');
        tpl.push('<div class="select-all"><label><input id="selectAll" checked type="checkbox"> (Select All)</label></div>');
        tpl.push('<div class="set-content">');
        tpl.push('</div>');
        return tpl.join('');
    }
    unsubscribeCkhList() {
        this.chkSubscriptionList.forEach(it => {
            it.unsubscribe();
            it.remove(it);
        });
    }
    removeItems() {
        let items = this._gui.querySelectorAll('.set-content .item');
        for (var i = 0; i < items.length; i++) {
            items[i].remove();
        }
    }
    bindData(data) {
        this.unsubscribeCkhList();
        let tpl = [], uncheckedList = this.getList(it => it.checked === false);
        this.removeItems();
        data.forEach((it, index) => {
            tpl.push('<div class="item">');
            if (this._col.params.cellRenderer) {
                tpl.push(`<label><input class="chk" ${uncheckedList.indexOf(it) < 0 ? 'checked' : ''} type="checkbox" value="${it}"> ${this._col.params.cellRenderer(it, index)}</label>`);
            }
            else {
                tpl.push(`<label><input class="chk" ${uncheckedList.indexOf(it) < 0 ? 'checked' : ''} type="checkbox" value="${it}"> ${it}</label>`);
            }
            tpl.push('</div>');
        });
        this._gui.querySelector('.set-content').innerHTML = tpl.join('');
        let chkList = this._gui.querySelectorAll('.set-content input.chk'), chkAll = this._gui.querySelector('#selectAll');
        for (let i = 0; i < chkList.length; i++) {
            this.chkSubscriptionList.push(Rx_1.Observable.fromEvent(chkList[i], 'click').subscribe(next => {
                this._isActive = true;
                let ischecked = this.getList(it => it.checked === true).length === this.getData().length;
                chkAll.checked = ischecked;
                this.doFilter();
                this._isActive = !ischecked;
            }));
        }
    }
}
exports.SetFilter = SetFilter;
