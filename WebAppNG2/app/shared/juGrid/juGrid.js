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
var TextFilter_1 = require('./TextFilter');
var NumberFilter_1 = require('./NumberFilter');
var SetFilter_1 = require('./SetFilter');
var Rx_1 = require('rxjs/Rx');
var rowEditor_1 = require('./rowEditor');
var juGrid = (function () {
    function juGrid(_elementRef, loader, viewContainerRef) {
        this._elementRef = _elementRef;
        this.loader = loader;
        this.viewContainerRef = viewContainerRef;
        this.options = {};
        this._oldItem = null;
        this._updtedItem = null;
        this._searchInActive = false;
        this.data = [];
        this.onLoad = new core_1.EventEmitter();
        this.panelMode = 'primary';
        this.headerHtml = [];
        this._colIndex = 0;
        this.totalCS = 0;
    }
    juGrid.prototype.ngOnChanges = function (changes) {
        if (this.dynamicComponent) {
            this.dynamicComponent.instance.setData(this.data);
        }
    };
    juGrid.prototype.addItem = function (item) {
        if (this.dynamicComponent) {
            if (this._searchInActive) {
                this.data.unshift(item);
            }
            this.dynamicComponent.instance.addItem(item);
        }
    };
    juGrid.prototype.getData = function () {
        return this.data.length ? this.data : this.dynamicComponent.instance.viewList;
    };
    juGrid.prototype.showMessage = function (message, messageCss) {
        var _this = this;
        if (messageCss === void 0) { messageCss = 'alert alert-info'; }
        this.options.message = message;
        this.options.messageCss = messageCss;
        if (this.dynamicComponent && this.dynamicComponent.instance) {
            this.dynamicComponent.instance.showMessage(message, messageCss);
            async_call(function () {
                _this.options.message = '';
                _this.dynamicComponent.instance.showMessage('', messageCss);
            });
        }
    };
    juGrid.prototype.updateItem = function (record) {
        if (this._oldItem && record) {
            for (var prop in record) {
                this._oldItem[prop] = record[prop];
            }
        }
    };
    juGrid.prototype.removeItem = function (item) {
        if (this.dynamicComponent) {
            if (this._searchInActive) {
                this.data.splice(this.data.indexOf(item), 1);
            }
            this.dynamicComponent.instance.removeItem(item);
        }
    };
    juGrid.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.options) {
            return;
        }
        this.options.pagerPos = this.options.pagerPos || 'top';
        this.options.pagerLeftPos = this.options.pagerLeftPos || 200;
        this.options.height = this.options.height || 500;
        this.options.rowHeight = this.options.rowHeight || 40;
        this.options.headerHeight = this.options.headerHeight || 40;
        this.options.linkPages = this.options.linkPages || 10;
        this.options.pageSize = this.options.pageSize || 10;
        this.options.confirmMessage = this.options.confirmMessage || 'Are you sure to remove this item?';
        if (!('scroll' in this.options)) {
            this.options.scroll = false;
        }
        if (!('colResize' in this.options)) {
            this.options.colResize = false;
        }
        if (!('crud' in this.options)) {
            this.options.crud = true;
        }
        if (!('create' in this.options)) {
            this.options.create = true;
        }
        if (!('update' in this.options)) {
            this.options.update = true;
        }
        if (!('remove' in this.options)) {
            this.options.remove = true;
        }
        if (!('quickSearch' in this.options)) {
            this.options.quickSearch = true;
        }
        if (!('trClass' in this.options)) {
            this.options.trClass = function () { return null; };
        }
        if (!('level' in this.options)) {
            this.options.level = 5;
        }
        this.options.rowEvents = this.options.rowEvents || '';
        if (this.options.crud) {
            this.options.newItem = function () {
                _this._oldItem = null;
                _this._updtedItem = null;
                _this.options.message = '';
                _this.dynamicComponent.instance.formObj.isUpdate = false;
                _this.dynamicComponent.instance.formObj.refresh();
                _this.dynamicComponent.instance.formObj.showModal();
                if (_this.options.insert_CB) {
                    _this.options.insert_CB(_this.dynamicComponent.instance.formObj);
                }
            };
            this.options.columnDefs.unshift({
                headerName: 'crud', width: 50, enable: this.options.create,
                action: [{
                        enable: this.options.update, title: 'Edit', icon: 'fa fa-pencil', click: function (data) {
                            _this._oldItem = data;
                            _this._updtedItem = Object.assign({}, data);
                            _this.options.message = '';
                            _this.dynamicComponent.instance.formObj.isUpdate = true;
                            _this.dynamicComponent.instance.formObj.setModel(_this._updtedItem);
                            _this.dynamicComponent.instance.formObj.showModal();
                            if (_this.options.update_CB) {
                                _this.options.update_CB(_this.dynamicComponent.instance.formObj, _this._updtedItem);
                            }
                        }
                    }, {
                        enable: this.options.remove, title: 'Remove', icon: 'fa fa-remove', click: function (data) {
                            if (confirm(_this.options.confirmMessage)) {
                                _this._oldItem = null;
                                _this._updtedItem = null;
                                if (_this.options.removeItem) {
                                    _this.options.removeItem(data);
                                }
                            }
                        }
                    }]
            });
        }
        this.loadComponent();
        this.options.api = { grid: this, form: null };
    };
    juGrid.prototype.loadComponent = function () {
        var _this = this;
        this.loader.loadNextToLocation(getComponent(this.getDynamicConfig()), this.viewContainerRef)
            .then(function (com) {
            _this.dynamicComponent = com;
            com.instance.config = _this.options;
            if (_this.options.data || _this.data) {
                _this.dynamicComponent.instance.setData(_this.data || _this.options.data);
            }
            if (!_this.options.crud) {
                async_call(function () { _this.onLoad.emit(_this); });
            }
            return com;
        });
    };
    juGrid.prototype.ngOnDestroy = function () {
        if (this.dynamicComponent) {
            this.dynamicComponent.destroy();
        }
    };
    juGrid.prototype.getUpdatedRecords = function () {
        if (this.dynamicComponent.instance && this.dynamicComponent.instance.editors) {
            return this.dynamicComponent.instance.editors.toArray().filter(function (_) { return _.isUpdated; }).map(function (_) { return _.model; });
        }
        return [];
    };
    juGrid.prototype.getDynamicConfig = function () {
        var tpl = [];
        if (this.viewMode && this.viewMode === "panel") {
            if (this.options.pagerPos === 'header') {
                tpl.push("<div class=\"panel panel-" + this.panelMode + "\">\n            <div class=\"panel-heading\" style=\"position:relative\">\n                <h3 class=\"panel-title\">" + this.title + " <b style=\"cursor:pointer\" (click)=\"slideToggle()\" class=\"pull-right fa fa-{{slideState==='down'?'minus':'plus'}}-circle\"></b></h3>\n                <div style=\"position:absolute;top:7px;left:" + this.options.pagerLeftPos + "px\" [style.display]=\"viewList?.length?'block':'none'\" class=\"juPager\" [linkPages]=\"config.linkPages\" [pageSize]=\"config.pageSize\" [data]=\"data\" (onInit)=\"pagerInit($event)\" (pageChange)=\"onPageChange($event)\"></div>\n                </div>\n            <div class=\"panel-body\" style=\"overflow:auto\">            \n            ");
            }
            else {
                tpl.push("<div class=\"panel panel-" + this.panelMode + "\">\n            <div class=\"panel-heading\" style=\"cursor:pointer\" (click)=\"slideToggle()\">\n                <h3 class=\"panel-title\">" + this.title + " <b class=\"pull-right fa fa-{{slideState==='down'?'minus':'plus'}}-circle\"></b></h3>\n            </div>\n            <div class=\"panel-body\" style=\"overflow:auto\">            \n            ");
            }
        }
        if (!this.options.classNames) {
            this.options.classNames = "table table-bordered table-striped";
        }
        if (this.options.columnDefs) {
            this.renderTable(tpl);
        }
        else {
            tpl.push('<div class="alert alert-info">There is no column defination</div>');
        }
        if (this.options.crud) {
        }
        tpl.push("<div class=\"filter-window\" #filterWindow>\n        <div class=\"title\" (click)=\"hideFilterWindow()\"><span>Title</span><a href=\"javascript:;\" title=\"Close filter window.\" ><b class=\"fa fa-remove\"></b></a></div>\n        <div class=\"filter-content\"></div>\n        </div>");
        if (this.viewMode && this.viewMode === "panel") {
            tpl.push('</div></div>');
        }
        return { tpl: tpl.join('') };
    };
    juGrid.prototype.getTotalWidth = function () {
        var totalWidth = 0;
        this.options.columnDefs.forEach(function (_) {
            _.width = _.width || 120;
            totalWidth += _.width;
        });
        return totalWidth + 25;
    };
    juGrid.prototype.renderTable = function (tpl) {
        if (this.options.pagerPos === 'top') {
            tpl.push("<div [style.display]=\"viewList?.length?'block':'none'\" class=\"juPager\" [linkPages]=\"config.linkPages\" [pageSize]=\"config.pageSize\" [data]=\"data\" (onInit)=\"pagerInit($event)\" (pageChange)=\"onPageChange($event)\"></div>");
        }
        tpl.push("<div style=\"width:" + this.getTotalWidth() + "px\">");
        tpl.push("<table class=\"" + this.options.classNames + " " + (this.options.scroll ? 'tbl-scroll' : '') + "\">");
        tpl.push('<thead>');
        tpl.push(this.getHeader(this.options.columnDefs));
        tpl.push('</thead>');
        tpl.push("<tbody (click)=\"hideFilterWindow()\" style=\"max-height:" + this.options.height + "px\">");
        tpl.push(this.options.enableCellEditing ? this.getCellEditingView() : this.options.enableTreeView ? this.getTreeView() : this.getPlainView());
        tpl.push('</tbody>');
        tpl.push('</table>');
        tpl.push('</div>');
        if (this.options.pagerPos === 'bottom') {
            tpl.push("<div [style.display]=\"viewList?.length?'block':'none'\" class=\"juPager\" [linkPages]=\"config.linkPages\" [pageSize]=\"config.pageSize\" [data]=\"data\" (onInit)=\"pagerInit($event)\" (pageChange)=\"onPageChange($event)\"></div>");
        }
    };
    juGrid.prototype.getCellEditingView = function () {
        var _this = this;
        var tpl = [];
        tpl.push("<tr " + this.options.rowEvents + " [ngClass]=\"config.trClass(row, i, f, l)\" [model]=\"row\" [config]=\"config\" class=\"row-editor\" *ngFor=\"let row of viewList;" + (this.options.trackBy ? 'trackBy:trackByResolver();' : '') + "let i = index;let f=first;let l = last\">");
        this.options.columnDefs.forEach(function (item, index) {
            _this.getCell(item, "config.columnDefs[" + index + "]", tpl, index);
        });
        tpl.push('</tr>');
        return tpl.join('');
    };
    juGrid.prototype.getDataExpression = function (item, config) {
        if (!item.dataSrc) {
            item.dataSrc = [];
        }
        if (Array.isArray(item.dataSrc)) {
            return config + ".dataSrc";
        }
        return config + ".dataSrc() | async";
    };
    juGrid.prototype.getHeaderName = function (item) {
    };
    juGrid.prototype.getCell = function (item, config, tpl, index) {
        var style = '', change = '', validation = '', header = '', rowHeight = "style=\"height:" + this.options.rowHeight + "px\"";
        if (item.type) {
            if (item.validators) {
                validation = " <i [ngClass]=\"isValid('" + item.field + "', i)\" class=\"validation fa fa-info-circle\" [title]=\"getValidationMsg('" + item.field + "', i)\"></i>";
            }
            item.width = item.width || 120;
            style = item.width ? "style=\"display:inline-block;\" [style.width.px]=\"config.columnDefs[" + index + "].width-40\"" : '';
            item.headerName = item.headerName || '';
            header = item.headerName.replace(/(<([^>]+)>)/ig, '');
            switch (item.type) {
                case 'juSelect':
                    change = item.change ? " (option-change)=\"" + config + ".change($event)\"" : '';
                    tpl.push("<td " + rowHeight + " [style.width.px]=\"config.columnDefs[" + index + "].width\"><div " + style + ">\n                    <juSelect \n                        " + change + " \n                        [config]=\"" + config + "\" \n                        [disabled]=\"" + config + ".disabled\"\n                        [hide-search]=\"" + (item.search ? 'false' : 'true') + "\"\n                        method=\"" + (item.method || 'getValues') + "\"\n                        [model]=\"row\"                        \n                        property-name=\"" + item.field + "\"\n                        view-mode=\"" + (item.viewMode || 'select') + "\"\n                        [data-src]=\"" + this.getDataExpression(item, config) + "\"\n                        [index]=\"i\"\n                    >\n                    </juSelect></div>");
                    tpl.push(validation);
                    tpl.push('</td>');
                    break;
                case 'select':
                    change = item.change ? "(change)=\"" + config + ".change(row, i)\"" : '';
                    tpl.push("<td " + rowHeight + " [style.width.px]=\"config.columnDefs[" + index + "].width\"><select " + style + " " + change + " class=\"select form-control\" [(ngModel)]=\"row." + item.field + "\" >\n                            <option value=\"\">{{" + config + ".emptyOptionText||'Select option'}}</option>\n                            <option *ngFor=\"let v of " + this.getDataExpression(item, config) + "\" [value]=\"v.value\">{{v.name}}</option>\n                        </select>");
                    tpl.push(validation);
                    tpl.push('</td>');
                    break;
                case 'html':
                    tpl.push("<td " + rowHeight + " [style.width.px]=\"config.columnDefs[" + index + "].width\">" + item.content + "</td>");
                    break;
                case 'datepicker':
                    tpl.push("<td " + rowHeight + " [style.width.px]=\"config.columnDefs[" + index + "].width\"><div " + style + ">\n                    <div class=\"input-group date\" [pickers]=\"" + config + ".config\" picker-name=\"" + item.type + "\" [model]=\"row\" property=\"" + item.field + "\" [config]=\"" + config + "\" [form]=\"myForm\" >\n                        <input type=\"text\" [disabled]=\"" + config + ".disabled\" [(ngModel)]=\"row." + item.field + "\" class=\"form-control\" placeholder=\"Enter " + header + "\">\n                        <span class=\"input-group-addon\">\n                            <span class=\"fa fa-calendar\"></span>\n                        </span>\n                    </div></div>");
                    tpl.push(validation);
                    tpl.push('</td>');
                    break;
                case 'text':
                case 'number':
                    tpl.push("<td " + rowHeight + " [style.width.px]=\"config.columnDefs[" + index + "].width\"><div " + style + "><input " + style + " class=\"text form-control\" type=\"" + item.type + "\" [(ngModel)]=\"row." + item.field + "\" placeholder=\"Enter " + header + "\">");
                    tpl.push('</div>');
                    tpl.push(validation);
                    tpl.push('</td>');
                    break;
                case 'textarea':
                    tpl.push("<td " + rowHeight + " [style.width.px]=\"config.columnDefs[" + index + "].width\"><div " + style + "><textarea " + style + " class=\"text form-control\" type=\"" + item.type + "\" [(ngModel)]=\"row." + item.field + "\" placeholder=\"Enter " + header + "\"></textarea>");
                    tpl.push('</div>');
                    tpl.push(validation);
                    tpl.push('</td>');
                    break;
                default:
                    tpl.push(this.getNormalTD(item, index));
                    break;
            }
        }
        else {
            tpl.push(this.getNormalTD(item, index));
        }
    };
    juGrid.prototype.getPlainView = function () {
        var _this = this;
        var tpl = [];
        tpl.push("<tr " + this.options.rowEvents + " [ngClass]=\"config.trClass(row, i, f, l)\" *ngFor=\"let row of viewList;" + (this.options.trackBy ? 'trackBy:trackByResolver();' : '') + "let i = index;let f=first;let l = last\">");
        this.options.columnDefs.forEach(function (item, index) {
            tpl.push(_this.getNormalTD(item, index));
        });
        tpl.push('</tr>');
        return tpl.join('');
    };
    juGrid.prototype.getNormalTD = function (item, index) {
        var tpl = [];
        tpl.push('<td ' + ("style=\"height:" + this.options.rowHeight + "px\" [title]=\"row." + item.field + "\" "));
        if (item.width) {
            tpl.push("[style.width.px]=\"config.columnDefs[" + index + "].width\"");
        }
        if (item.tdClass) {
            tpl.push("[ngClass]=\"config.columnDefs[" + index + "].tdClass(row, i, f, l)\"");
        }
        if (item.action) {
            tpl.push('>');
            item.action.forEach(function (ac, aci) {
                if (item.headerName === 'crud') {
                    if (ac.enable == true) {
                        tpl.push("<a href=\"javascript:;\" title=\"" + ac.title + "\" (click)=\"config.columnDefs[" + index + "].action[" + aci + "].click(row)\"><b class=\"" + ac.icon + "\"></b></a> ");
                    }
                }
                else {
                    tpl.push("<a href=\"javascript:;\" title=\"" + ac.title + "\" (click)=\"config.columnDefs[" + index + "].action[" + aci + "].click(row)\"><b class=\"" + ac.icon + "\"></b></a> ");
                }
            });
        }
        else if (item.cellRenderer) {
            tpl.push(" [innerHTML]=\"config.columnDefs[" + index + "].cellRenderer(row,i,f, l)\">");
        }
        else if (item.field) {
            tpl.push(">{{row." + item.field + "}}");
        }
        else {
            tpl.push(">");
        }
        tpl.push('</td>');
        return tpl.join('');
    };
    juGrid.prototype.getParams = function (row, level) {
        return level === 0 ? row + ", i, f, l" : row + ", i" + level + ", f" + level + ", l" + level;
    };
    juGrid.prototype.getLevel = function (index, level) {
        return index === 0 ? "class=\"level-" + level + "\"" : '';
    };
    juGrid.prototype.renderTr = function (row, level, previousChild) {
        var _this = this;
        if (previousChild === void 0) { previousChild = 'row'; }
        var tpl = [];
        if (level > 0) {
            tpl.push("<template [ngIf]=\"" + previousChild + ".expand\">");
            tpl.push("<template ngFor let-" + row + " [ngForOf]=\"" + previousChild + ".items\" let-i" + level + "=\"index\" let-f" + level + "=\"first\" let-l" + level + "=\"last\" " + (this.options.trackBy ? '[ngForTrackBy]="trackByResolver()"' : '') + ">");
        }
        tpl.push("<tr " + this.options.rowEvents + " [ngClass]=\"config.trClass(" + this.getParams(row, level) + ")\">");
        this.options.columnDefs.forEach(function (item, index) {
            tpl.push("<td " + _this.getLevel(index, level));
            if (item.tdClass) {
                tpl.push("[ngClass]=\"config.columnDefs[" + index + "].tdClass(" + _this.getParams(row, level) + ")\"");
            }
            if (item.action) {
                tpl.push('>');
                if (index === 0) {
                    tpl.push("<a *ngIf=\"" + row + ".hasChild||" + row + ".items\" href=\"javascript:;\" (click)=\"toggleChildView(" + row + ")\" title=\"Toggling for child view.\"><b class=\"fa fa-{{" + row + ".expand?'minus':'plus'}}-square-o\"></b></a>");
                }
                item.action.forEach(function (ac, aci) {
                    if (item.headerName === 'crud') {
                        if (ac.enable == true) {
                            tpl.push(" <a href=\"javascript:;\" title=\"" + ac.title + "\" (click)=\"config.columnDefs[" + index + "].action[" + aci + "].click(" + row + ")\"><b class=\"" + ac.icon + "\"></b></a> ");
                        }
                    }
                    else {
                        tpl.push(" <a href=\"javascript:;\" title=\"" + ac.title + "\" (click)=\"config.columnDefs[" + index + "].action[" + aci + "].click(" + row + ")\"><b class=\"" + ac.icon + "\"></b></a> ");
                    }
                });
            }
            else if (item.cellRenderer) {
                if (index === 0) {
                    tpl.push("><a *ngIf=\"" + row + ".hasChild||" + row + ".items\" href=\"javascript:;\" (click)=\"toggleChildView(" + row + ")\" title=\"Toggling for child view.\"><b class=\"fa fa-{{" + row + ".expand?'minus':'plus'}}-square-o\"></b></a>\n                 <span class=\"child-renderer\" [innerHTML]=\"config.columnDefs[" + index + "].cellRenderer(" + _this.getParams(row, level) + ")\"></span>");
                }
                else {
                    tpl.push(" [innerHTML]=\"config.columnDefs[" + index + "].cellRenderer(" + _this.getParams(row, level) + ")\">");
                }
            }
            else if (item.field) {
                if (index === 0) {
                    tpl.push("><a *ngIf=\"" + row + ".hasChild||" + row + ".items\" href=\"javascript:;\" (click)=\"toggleChildView(" + row + ")\" title=\"Toggling for child view.\"><b class=\"fa fa-{{" + row + ".expand?'minus':'plus'}}-square-o\"></b></a>\n                        {{" + row + "." + item.field + "}}");
                }
                else {
                    tpl.push(">{{" + row + "." + item.field + "}}");
                }
            }
            else {
                tpl.push(">");
            }
            tpl.push('</td>');
        });
        tpl.push('</tr>');
        return tpl.join('');
    };
    juGrid.prototype.getTreeView = function () {
        var tpl = [];
        tpl.push("<template ngFor let-row [ngForOf]=\"viewList\" let-i=\"index\" let-f=\"first\" let-l=\"last\" " + (this.options.trackBy ? '[ngForTrackBy]="trackByResolver()"' : '') + ">");
        tpl.push(this.renderTr('row', 0));
        tpl.push(this.renderTr('child1', 1, 'row'));
        var temp = [];
        for (var i = 2; i <= this.options.level; i++) {
            tpl.push(this.renderTr('child' + i, i, 'child' + (i - 1)));
            temp.push('</template></template>');
        }
        tpl.push(temp.join(''));
        tpl.push('</template>');
        tpl.push('</template>');
        tpl.push('</template>');
        return tpl.join('');
    };
    juGrid.prototype.renderForm = function (tpl) {
        tpl.push("<juForm viewMode=\"popup\" title=\"Sample Form\" (onLoad)=\"onFormLoad($event)\" [options]=\"config.formDefs\"></juForm>");
    };
    juGrid.prototype.getHeader = function (hederDef) {
        var _this = this;
        var colDef = [], rc = this.row_count(hederDef), i = 0;
        while (i < rc) {
            this.headerHtml[i] = [];
            i++;
        }
        hederDef.forEach(function (it) {
            _this.traverseCell(it, rc, 0, colDef);
        });
        if (rc > 1) {
            this.options.columnDefs = colDef;
        }
        if (this.options.colResize) {
            this.headerHtml[0].push("<th style=\"width:20px;height:" + this.options.headerHeight + "px\">&nbsp;</th>");
        }
        return this.headerHtml.map(function (_) { return ("<tr>" + _.join('') + "</tr>"); }).reduce(function (p, c) { return p + c; }, '');
    };
    juGrid.prototype.traverseCell = function (cell, rs, headerRowFlag, colDef) {
        if (cell.children) {
            this.headerHtml[headerRowFlag].push('<th');
            if (cell.children.length > 1) {
                this.totalCS = 0;
                this.getColSpan(cell);
                this.headerHtml[headerRowFlag].push(" colspan=\"" + this.totalCS + "\"");
            }
            this.headerHtml[headerRowFlag].push(">" + cell.headerName + "</th>");
            headerRowFlag++;
            var rc = rs, hf = headerRowFlag;
            for (var i = 0; i < cell.children.length; i++) {
                this.traverseCell(cell.children[i], --rs, headerRowFlag, colDef);
                rs = rc;
            }
        }
        else {
            colDef.push(cell);
            this.headerHtml[headerRowFlag].push("<th style=\"height:" + this.options.headerHeight + "px\" ");
            if (rs > 1) {
                this.headerHtml[headerRowFlag].push(" valign=\"bottom\" rowspan=\"" + rs + "\"");
            }
            if (cell.width) {
                this.headerHtml[headerRowFlag].push(" [style.width.px]=\"config.columnDefs[" + this._colIndex + "].width\"");
            }
            if (cell.sort) {
                this.headerHtml[headerRowFlag].push(" (click)=\"sort(config.columnDefs[" + this._colIndex + "])\"");
            }
            if (cell.filter) {
                this.headerHtml[headerRowFlag].push(" (mouseenter)=\"config.columnDefs[" + this._colIndex + "].filterCss={'icon-hide':false,'icon-show':true}\"");
                this.headerHtml[headerRowFlag].push(" (mouseleave)=\"config.columnDefs[" + this._colIndex + "].filterCss={'icon-hide':!config.columnDefs[" + this._colIndex + "].isOpened,'icon-show':config.columnDefs[" + this._colIndex + "].isOpened}\"");
            }
            if (cell.headerName === 'crud' && cell.enable) {
                this.headerHtml[headerRowFlag].push("><a href=\"javascript:;\" title=\"New item\" (click)=\"config.newItem()\"><b class=\"fa fa-plus-circle\"></b> </a></th>");
            }
            else {
                this.headerHtml[headerRowFlag].push(' >');
                if (cell.sort) {
                    this.headerHtml[headerRowFlag].push("<b [ngClass]=\"sortIcon(config.columnDefs[" + this._colIndex + "])\" class=\"fa\"></b>");
                }
                if (cell.filter) {
                    this.headerHtml[headerRowFlag].push(" <b [ngClass]=\"filterIcon(config.columnDefs[" + this._colIndex + "])\" class=\"fa fa-filter\"></b>");
                }
                this.headerHtml[headerRowFlag].push(" <span>" + cell.headerName + "</span>");
                if (cell.filter) {
                    this.headerHtml[headerRowFlag].push("<a href=\"javascript:;\" title=\"Show filter window.\" [ngClass]=\"config.columnDefs[" + this._colIndex + "].filterCss\" (click)=\"showFilter(config.columnDefs[" + this._colIndex + "], $event)\" class=\"filter-bar icon-hide\"><b class=\"fa fa-filter\"></b></a>");
                }
                this.headerHtml[headerRowFlag].push('</th>');
            }
            this._colIndex++;
        }
    };
    juGrid.prototype.row_count = function (hederDef) {
        var max = 0;
        for (var i = 0; i < hederDef.length; i++) {
            max = Math.max(max, this.cal_header_row(hederDef[i], 1));
        }
        return max;
    };
    juGrid.prototype.cal_header_row = function (cell, row_count) {
        var max = row_count;
        if (cell.children) {
            row_count++;
            for (var i = 0; i < cell.children.length; i++) {
                max = Math.max(max, this.cal_header_row(cell.children[i], row_count));
            }
        }
        return max;
    };
    juGrid.prototype.getColSpan = function (cell) {
        var _this = this;
        if (cell.children) {
            cell.children.forEach(function (it) {
                _this.totalCS++;
                _this.getColSpanHelper(it);
            });
        }
    };
    juGrid.prototype.getColSpanHelper = function (cell) {
        var _this = this;
        if (cell.children) {
            this.totalCS--;
            cell.children.forEach(function (it) {
                _this.totalCS++;
                _this.getColSpan(it);
            });
        }
    };
    juGrid.prototype.setDropdownData = function (key, value) {
        this.dynamicComponent.instance.setDropdownData(key, value);
    };
    juGrid.prototype.setJuSelectData = function (key, value, index) {
        this.dynamicComponent.instance.setJuSelectData(key, value, index);
    };
    juGrid.prototype.slideToggle = function () {
        this.dynamicComponent.instance.slideToggle();
    };
    juGrid.prototype.search = function (val) {
        var _this = this;
        if (this.options.sspFn) {
            this.options.api.pager.search(val);
            return;
        }
        if (!val) {
            this._searchInActive = false;
            this.dynamicComponent.instance.data = this.data;
            return;
        }
        this._searchInActive = true;
        val = val.toLowerCase();
        var res = [];
        var len = this.options.columnDefs.length;
        this.data.forEach(function (item) {
            for (var index = 0; index < len; index++) {
                var item2 = _this.options.columnDefs[index];
                if (item2.field && item[item2.field] && item[item2.field].toString().toLowerCase().indexOf(val) != -1) {
                    res.push(item);
                    break;
                }
            }
        });
        this.dynamicComponent.instance.data = res;
    };
    juGrid.prototype.onFormLoad = function (form) {
        this.dynamicComponent.instance.formObj = form;
        this.options.api.form = form;
        if (this.options.onFormLoad) {
            this.options.onFormLoad(form);
        }
        this.onLoad.emit(this);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], juGrid.prototype, "options", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], juGrid.prototype, "data", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], juGrid.prototype, "onLoad", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], juGrid.prototype, "viewMode", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], juGrid.prototype, "title", void 0);
    __decorate([
        core_1.Input('panelMode'), 
        __metadata('design:type', String)
    ], juGrid.prototype, "panelMode", void 0);
    juGrid = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: '.juGrid, [juGrid], juGrid',
            templateUrl: './juGrid.html',
            styleUrls: ['./juGrid.css'],
            encapsulation: core_1.ViewEncapsulation.None,
            changeDetection: core_1.ChangeDetectionStrategy.Default
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.DynamicComponentLoader, core_1.ViewContainerRef])
    ], juGrid);
    return juGrid;
}());
exports.juGrid = juGrid;
function getComponent(obj) {
    var TableComponent = (function () {
        function TableComponent(renderer, el) {
            this.renderer = renderer;
            this.el = el;
            this.data = [];
            this.config = {};
            this.viewList = [];
            this.slideState = 'down';
        }
        TableComponent.prototype.isValid = function (fieldName, index) {
            var arr = this.editors.toArray();
            if (arr.length > index) {
                return arr[index].isValid(fieldName);
            }
            return { 'validation-msg-hide': true };
        };
        TableComponent.prototype.getValidationMsg = function (fieldName, index) {
            var arr = this.editors.toArray();
            if (arr.length > index) {
                return arr[index].getValidationMsg(fieldName);
            }
            return '';
        };
        TableComponent.prototype.ngOnInit = function () {
            if (this.config.colResize) {
                this.columnResizing();
            }
        };
        TableComponent.prototype.columnResizing = function () {
            var _this = this;
            var thList = this.el.nativeElement.querySelectorAll('table thead tr th'), mousemove$ = Rx_1.Observable.fromEvent(document, 'mousemove'), mouseup$ = Rx_1.Observable.fromEvent(document, 'mouseup'), startX = 0, w1 = 0, w2 = 0, not_mousedown = true;
            thList.forEach(function (th, index) {
                Rx_1.Observable.fromEvent(th, 'mousemove')
                    .filter(function (_) { return index !== 0 && index + 1 !== thList.length; })
                    .filter(function (e) {
                    if (e.target.tagName === 'TH') {
                        if (Math.abs(e.x - _this.findPosX(e.target)) < 7) {
                            e.target.style.cursor = 'col-resize';
                            return true;
                        }
                        if (not_mousedown) {
                            e.target.style.cursor = 'default';
                        }
                        return false;
                    }
                    return false;
                })
                    .flatMap(function (e) {
                    return Rx_1.Observable.fromEvent(e.target, 'mousedown')
                        .do(function (e) {
                        not_mousedown = false;
                        startX = e.x;
                        w1 = _this.config.columnDefs[index - 1].width;
                        w2 = _this.config.columnDefs[index].width;
                    });
                })
                    .flatMap(function (e) { return mousemove$
                    .map(function (e) { return e.x - startX; })
                    .takeUntil(mouseup$.do(function (e) { return not_mousedown = true; })); })
                    .distinctUntilChanged()
                    .filter(function (e) { return e < 0 ? w1 + e > 20 : w2 - e > 20; })
                    .subscribe(function (e) {
                    _this.config.columnDefs[index - 1].width = w1 + e;
                    _this.config.columnDefs[index].width = w2 - e;
                });
            });
        };
        TableComponent.prototype.findPosX = function (obj) {
            var curleft = 0;
            if (obj.offsetParent) {
                while (obj.offsetParent) {
                    curleft += obj.offsetLeft;
                    obj = obj.offsetParent;
                }
            }
            else if (obj.x)
                curleft += obj.x;
            return curleft;
        };
        TableComponent.prototype.slideToggle = function () {
            jQuery(this.el.nativeElement).find('.panel-body').slideToggle();
            this.slideState = this.slideState === 'down' ? 'up' : 'down';
        };
        TableComponent.prototype.ngOnDestroy = function () {
            this.config.columnDefs
                .filter(function (it) { return it.filterApi; })
                .forEach(function (it) { it.filterApi.destroy(); });
        };
        TableComponent.prototype.trackByResolver = function () {
            var _this = this;
            return function (index, obj) { return obj[_this.config.trackBy]; };
        };
        TableComponent.prototype.pagerInit = function (pager) {
            this.pager = pager;
            this.config.api.pager = pager;
            this.pager.sspFn = this.config.sspFn;
        };
        TableComponent.prototype.onFormLoad = function (form) {
            this.formObj = form;
            if (this.config.onFormLoad) {
                this.config.onFormLoad(form);
            }
        };
        TableComponent.prototype.setDropdownData = function (key, value) {
            var col = this.config.columnDefs.find(function (_) { return _.field === key; });
            col.dataSrc = value;
        };
        TableComponent.prototype.setJuSelectData = function (key, value, index) {
            this.editors.toArray()[index].setJuSelectData(key, value);
        };
        TableComponent.prototype.setData = function (data) {
            this.data = data;
            this.notifyFilter();
            this._copyOfData = data.slice();
        };
        TableComponent.prototype.onPageChange = function (list) {
            var _this = this;
            async_call(function () { _this.viewList = list; });
        };
        TableComponent.prototype.addItem = function (item) {
            this.data.unshift(item);
            this._copyOfData.unshift(item);
            this.pager.calculatePagelinkes();
            this.notifyFilter();
        };
        TableComponent.prototype.updateItem = function (item) {
        };
        TableComponent.prototype.removeItem = function (item) {
            this.data.splice(this.data.indexOf(item), 1);
            this._copyOfData.splice(this.data.indexOf(item), 1);
            this.pager.calculatePagelinkes();
            this.notifyFilter();
        };
        TableComponent.prototype.showMessage = function (message, messageCss) {
            if (this.formObj) {
                this.formObj.showMessage(message, messageCss);
            }
        };
        TableComponent.prototype.sort = function (colDef) {
            colDef.reverse = !(typeof colDef.reverse === 'undefined' ? true : colDef.reverse);
            this.config.columnDefs.forEach(function (_) {
                if (_ !== colDef) {
                    _.reverse = undefined;
                }
            });
            if (this.config.sspFn) {
                this.pager.sort(colDef.field, colDef.reverse);
                return;
            }
            var reverse = !colDef.reverse ? 1 : -1, sortFn = typeof colDef.comparator === 'function' ?
                function (a, b) { return reverse * colDef.comparator(a, b); } :
                function (a, b) { return a = a[colDef.field], b = b[colDef.field], reverse * ((a > b) - (b > a)); };
            this.data = this.data.sort(sortFn).slice();
        };
        TableComponent.prototype.sortIcon = function (colDef) {
            var hidden = typeof colDef.reverse === 'undefined';
            return { 'fa-sort not-active': hidden, 'fa-caret-up': colDef.reverse === false, 'fa-caret-down': colDef.reverse === true };
        };
        TableComponent.prototype.filterIcon = function (colDef) {
            return { 'icon-hide': !(colDef.filterApi && colDef.filterApi.isFilterActive()), 'icon-show': colDef.filterApi && colDef.filterApi.isFilterActive() };
        };
        TableComponent.prototype.toggleChildView = function (row) {
            row.expand = !row.expand;
            if (!(row.items && row.items.length > 0) && this.config.lazyLoad) {
                this.config.lazyLoad(row).subscribe(function (next) {
                    row.items = next;
                });
            }
        };
        TableComponent.prototype.showFilter = function (colDef, event) {
            event.preventDefault();
            event.stopPropagation();
            if (colDef === this.currentFilter && colDef.isOpened) {
                return;
            }
            this.hideFilterBar();
            this.currentFilter = colDef;
            colDef.isOpened = true;
            if (!this.filterWindow) {
                this.filterWindow = jQuery(this.filterWindowRef.nativeElement);
            }
            var parent = jQuery(event.target).parents('th'), parentOffset = parent.offset();
            this.buildFilter(colDef);
            this.filterWindow.find('.filter-content').html(colDef.filterApi.getGui());
            this.filterWindow.find('.title span').html(colDef.headerName);
            this.filterWindow.css({ top: parentOffset.top + parent.height() + 7, left: parentOffset.left }).show();
        };
        TableComponent.prototype.buildFilter = function (colDef) {
            try {
                if (!colDef.filterApi) {
                    switch (colDef.filter) {
                        case 'text':
                            colDef.filterApi = new TextFilter_1.TextFilter();
                            break;
                        case 'number':
                            colDef.filterApi = new NumberFilter_1.NumberFilter();
                            break;
                        case 'set':
                            colDef.filterApi = new SetFilter_1.SetFilter();
                            break;
                        default:
                            colDef.filterApi = new colDef.filter();
                            break;
                    }
                    colDef.gridApi = this;
                    colDef.params = colDef.params || {};
                    colDef.filterChangedCallback = this.filterChangedCallback.bind(this);
                    colDef.valueGetter = this.valueGetter;
                    colDef.filterApi.init(colDef);
                }
                if (colDef.filter === 'set' && !colDef.params.value && colDef.dataUpdated) {
                    colDef.filterApi.data = this._copyOfData
                        .map(function (item) {
                        return colDef.params.valueGetter ? colDef.params.valueGetter(item) : item[colDef.field];
                    }).filter(function (value, index, self) { return self.indexOf(value) === index; });
                    colDef.filterApi.bindData(colDef.filterApi.data);
                    colDef.dataUpdted = false;
                }
            }
            catch (e) {
                console.error(e.message);
            }
        };
        TableComponent.prototype.notifyFilter = function () {
            this.config.columnDefs.forEach(function (it) {
                if (it.filter) {
                    it.dataUpdated = true;
                }
            });
        };
        TableComponent.prototype.valueGetter = function (colDef) {
            try {
                if (colDef.params.valueGetter) {
                    return colDef.params.valueGetter(colDef.row);
                }
                return colDef.row[colDef.field];
            }
            catch (e) {
                console.error(e.message);
            }
        };
        TableComponent.prototype.filterChangedCallback = function () {
            var activeFilters = this.config.columnDefs.filter(function (it) { return it.filterApi && it.filterApi.isFilterActive(); });
            if (this.config.sspFn) {
                var filter = activeFilters.map(function (_) { return ({ field: _.field, searchCategory: _.filterApi.searchCategory, searchText: _.filterApi.searchText }); });
                this.pager.filter(filter);
                return;
            }
            var temp = [];
            this._copyOfData.forEach(function (row) {
                var flag = true;
                activeFilters.forEach(function (col, index) {
                    col.row = row;
                    flag &= col.filterApi.doesFilterPass(col);
                });
                if (flag) {
                    temp.push(row);
                }
            });
            this.data = temp;
        };
        TableComponent.prototype.hideFilterWindow = function () {
            if (this.filterWindow) {
                this.filterWindow.hide();
                this.hideFilterBar();
            }
        };
        TableComponent.prototype.hideFilterBar = function () {
            if (this.currentFilter) {
                this.currentFilter.isOpened = false;
                this.currentFilter.filterCss = { 'icon-hide': true, 'icon-show': false };
            }
        };
        __decorate([
            core_1.ViewChildren(rowEditor_1.rowEditor), 
            __metadata('design:type', core_1.QueryList)
        ], TableComponent.prototype, "editors", void 0);
        __decorate([
            core_1.ViewChild('filterWindow'), 
            __metadata('design:type', core_1.ElementRef)
        ], TableComponent.prototype, "filterWindowRef", void 0);
        TableComponent = __decorate([
            core_1.Component({
                selector: 'dynamic-grid',
                template: obj.tpl,
                encapsulation: core_1.ViewEncapsulation.None,
                animations: [
                    core_1.trigger('slide', [
                        core_1.state('up', core_1.style({ opacity: 0, height: 0, padding: '0px' })),
                        core_1.state('down', core_1.style({ opacity: 1, height: '*' })),
                        core_1.transition('up => down', core_1.animate('300ms ease-in')),
                        core_1.transition('down => up', core_1.animate('200ms ease-out'))
                    ])
                ]
            }), 
            __metadata('design:paramtypes', [core_1.Renderer, core_1.ElementRef])
        ], TableComponent);
        return TableComponent;
    }());
    return TableComponent;
}
function async_call(fx, time) {
    if (time === void 0) { time = 0; }
    var tid = setTimeout(function () {
        fx();
        clearTimeout(tid);
    }, time);
}
//# sourceMappingURL=juGrid.js.map