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
var compiler_1 = require('@angular/compiler');
var shared_module_1 = require('../shared.module');
var TextFilter_1 = require('./TextFilter');
var NumberFilter_1 = require('./NumberFilter');
var SetFilter_1 = require('./SetFilter');
var Rx_1 = require('rxjs/Rx');
var rowEditor_1 = require('./rowEditor');
var juGridBuilder = (function () {
    function juGridBuilder(compiler) {
        this.compiler = compiler;
        this.options = {};
        this.headerHtml = [];
        this._colIndex = 0;
        this.totalCS = 0;
    }
    juGridBuilder.prototype.getTotalWidth = function () {
        var totalWidth = 0;
        this.options.columnDefs.forEach(function (_) {
            if (_.hide)
                return;
            _.width = _.width || 120;
            totalWidth += _.width;
        });
        return totalWidth + 25;
    };
    juGridBuilder.prototype.getPager = function (isHeader) {
        if (isHeader === void 0) { isHeader = false; }
        var style = isHeader ? "style=\"position:absolute;top:7px;left:" + this.options.pagerLeftPos + "px\"" : '';
        return "<div " + style + " [style.display]=\"viewList?.length?'block':'none'\" class=\"juPager\" [linkPages]=\"config.linkPages\" [enablePowerPage]=\"config.enablePowerPage\" [enablePageSearch]=\"config.enablePageSearch\" [pageSize]=\"config.pageSize\" [data]=\"data\" (onInit)=\"pagerInit($event)\" (pageChange)=\"onPageChange($event)\"></div>";
    };
    juGridBuilder.prototype.renderTable = function (tpl) {
        this.options.width = this.getTotalWidth();
        tpl.push("<div [style.display]=\"config.message?'block':'none'\" [class]=\"config.messageCss\">{{config.message}}</div>");
        if (this.options.pagerPos === 'top') {
            tpl.push(this.getPager());
        }
        tpl.push("<div class=\"ju-grid\" [ngStyle]=\"getStyle(tc1, tc2)\">\n            <div style=\"overflow:hidden\" #headerDiv>\n                <div [style.width.px]=\"config.width\">\n                    <table  class=\"" + this.options.classNames + " theader " + (this.options.colResize ? 'tbl-resize' : '') + "\">\n                        <thead>\n                            " + this.getHeader(this.options.columnDefs) + "\n                        </thead>\n                     </table>\n                </div>\n            </div>\n\n            <div #tc1 style=\"max-height:" + this.options.height + "px;overflow:auto;\" class=\"tbl-body-content\" (scroll)=\"tblScroll($event, headerDiv)\">\n                <div #tc2 [style.width.px]=\"config.width - 22\">\n                    <table class=\"" + this.options.classNames + " tbody " + (this.options.colResize ? 'tbl-resize' : '') + "\">\n                        <tbody (click)=\"hideFilterWindow()\">\n                            " + (this.options.enableCellEditing ? this.getCellEditingView() : this.options.enableTreeView ? this.getTreeView() : this.getPlainView()) + "\n                        </tbody>\n                    </table>\n                </div>\n            </div>            \n        </div>");
        if (this.options.pagerPos === 'bottom') {
            tpl.push('<div style="height:5px;"></div>');
            tpl.push(this.getPager());
        }
    };
    juGridBuilder.prototype.getCellEditingView = function () {
        var _this = this;
        var tpl = [];
        tpl.push("<tr " + this.options.rowEvents + " [ngClass]=\"config.trClass(row, i, f, l)\" [model]=\"row\" [config]=\"config\" class=\"row-editor\" *ngFor=\"let row of viewList;" + (this.options.trackBy ? 'trackBy:trackByResolver();' : '') + "let i = index;let f=first;let l = last\">");
        this.options.columnDefs.forEach(function (item, index) {
            if (item.hide)
                return;
            _this.getCell(item, "config.columnDefs[" + index + "]", tpl, index);
        });
        tpl.push('</tr>');
        return tpl.join('');
    };
    juGridBuilder.prototype.getDataExpression = function (item, config) {
        if (!item.dataSrc) {
            item.dataSrc = [];
        }
        return config + ".dataSrc";
    };
    juGridBuilder.prototype.getCell = function (item, config, tpl, index) {
        var style = '', change = '', validation = '', header = '', rowHeight = this.options.rowHeight > 0 ? "style=\"height:" + this.options.rowHeight + "px\"" : '';
        if (item.type) {
            if (item.validators) {
                validation = " <i [ngClass]=\"isValid('" + item.field + "', i)\" class=\"validation fa fa-info-circle\" [title]=\"getValidationMsg('" + item.field + "', i)\"></i>";
            }
            item.width = item.width || 120;
            style = item.width ? "style=\"display:inline-block;\" [style.width.px]=\"(config.columnDefs[" + index + "].width-(isValid('" + item.field + "', i)['validation-msg-hide']?18:40))\"" : '';
            item.headerName = item.headerName || '';
            header = item.headerName.replace(/(<([^>]+)>)/ig, '');
            switch (item.type) {
                case 'juSelect':
                    change = item.change ? " (option-change)=\"" + config + ".change($event)\"" : '';
                    tpl.push("<td " + rowHeight + " [style.width.px]=\"config.columnDefs[" + index + "].width\"><div " + style + ">\n                    <juSelect \n                        " + change + " \n                        [config]=\"" + config + "\"\n                        [model]=\"row\"\n                        [value]=\"row['" + item.field + "']\"                        \n                        property-name=\"" + item.field + "\"                       \n                        [data]=\"" + this.getDataExpression(item, config) + "\"\n                        [options]=\"" + config + ".options||{}\"\n                        [index]=\"i\"                        \n                    >\n                    </juSelect></div>");
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
    juGridBuilder.prototype.getPlainView = function () {
        var _this = this;
        var tpl = [];
        tpl.push("<tr " + this.options.rowEvents + " [ngClass]=\"config.trClass(row, i, f, l)\" *ngFor=\"let row of viewList;" + (this.options.trackBy ? 'trackBy:trackByResolver();' : '') + "let i = index;let f=first;let l = last\">");
        this.options.columnDefs.forEach(function (item, index) {
            if (item.hide)
                return;
            tpl.push(_this.getNormalTD(item, index));
        });
        tpl.push('</tr>');
        return tpl.join('');
    };
    juGridBuilder.prototype.getNormalTD = function (item, index) {
        var tpl = [], rowHeight = this.options.rowHeight > 0 ? "style=\"height:" + this.options.rowHeight + "px\"" : '';
        tpl.push('<td ' + (rowHeight + " [title]=\"row." + item.field + "\" "));
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
        else if (item.exp) {
            tpl.push(">" + item.exp);
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
    juGridBuilder.prototype.getParams = function (row, level) {
        return level === 0 ? row + ", i, f, l" : row + ", i" + level + ", f" + level + ", l" + level;
    };
    juGridBuilder.prototype.getLevel = function (index, level) {
        return index === 0 ? "class=\"level-" + level + "\"" : '';
    };
    juGridBuilder.prototype.renderTr = function (row, level, previousChild) {
        var _this = this;
        if (previousChild === void 0) { previousChild = 'row'; }
        var tpl = [];
        if (level > 0) {
            tpl.push("<template [ngIf]=\"" + previousChild + ".expand\">");
            tpl.push("<template ngFor let-" + row + " [ngForOf]=\"" + previousChild + ".items\" let-i" + level + "=\"index\" let-f" + level + "=\"first\" let-l" + level + "=\"last\" " + (this.options.trackBy ? '[ngForTrackBy]="trackByResolver()"' : '') + ">");
        }
        tpl.push("<tr " + this.options.rowEvents + " [ngClass]=\"config.trClass(" + this.getParams(row, level) + ")\">");
        this.options.columnDefs.forEach(function (item, index) {
            if (item.hide)
                return;
            tpl.push("<td [style.width.px]=\"config.columnDefs[" + index + "].width\" " + _this.getLevel(index, level));
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
                var exp = item.exp ? item.exp : "{{" + row + "." + item.field + "}}";
                if (index === 0) {
                    tpl.push("><a *ngIf=\"" + row + ".hasChild||" + row + ".items\" href=\"javascript:;\" (click)=\"toggleChildView(" + row + ")\" title=\"Toggling for child view.\"><b class=\"fa fa-{{" + row + ".expand?'minus':'plus'}}-square-o\"></b></a>\n                        " + exp);
                }
                else {
                    tpl.push(">" + exp);
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
    juGridBuilder.prototype.getTreeView = function () {
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
    juGridBuilder.prototype.getHeader = function (hederDef) {
        var _this = this;
        this._colIndex = 0;
        var colDef = [], rc = this.row_count(hederDef), i = 0;
        while (i < rc) {
            this.headerHtml[i] = [];
            i++;
        }
        hederDef.forEach(function (it, i) {
            _this._colIndex = i;
            if (it.hide)
                return;
            _this.traverseCell(it, rc, 0, colDef);
        });
        if (rc > 1) {
            this.options.columnDefs = colDef;
        }
        return this.headerHtml.map(function (_) { return ("<tr>" + _.join('') + "</tr>"); }).reduce(function (p, c) { return p + c; }, '');
    };
    juGridBuilder.prototype.traverseCell = function (cell, rs, headerRowFlag, colDef) {
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
            var rh = this.options.headerHeight > 0 ? "style=\"height:" + this.options.headerHeight + "px\"" : '';
            this.headerHtml[headerRowFlag].push("<th " + rh + " ");
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
        }
    };
    juGridBuilder.prototype.row_count = function (hederDef) {
        var max = 0;
        for (var i = 0; i < hederDef.length; i++) {
            max = Math.max(max, this.cal_header_row(hederDef[i], 1));
        }
        return max;
    };
    juGridBuilder.prototype.cal_header_row = function (cell, row_count) {
        var max = row_count;
        if (cell.children) {
            row_count++;
            for (var i = 0; i < cell.children.length; i++) {
                max = Math.max(max, this.cal_header_row(cell.children[i], row_count));
            }
        }
        return max;
    };
    juGridBuilder.prototype.getColSpan = function (cell) {
        var _this = this;
        if (cell.children) {
            cell.children.forEach(function (it) {
                _this.totalCS++;
                _this.getColSpanHelper(it);
            });
        }
    };
    juGridBuilder.prototype.getColSpanHelper = function (cell) {
        var _this = this;
        if (cell.children) {
            this.totalCS--;
            cell.children.forEach(function (it) {
                _this.totalCS++;
                _this.getColSpan(it);
            });
        }
    };
    juGridBuilder.prototype.getTemplate = function () {
        var tpl = [];
        if (this.options.viewMode && this.options.viewMode === "panel") {
            if (this.options.pagerPos === 'header') {
                tpl.push("<div class=\"panel panel-" + this.options.panelMode + "\">\n            <div class=\"panel-heading\" style=\"position:relative\">\n                <h3 class=\"panel-title\">" + this.options.title + " <b style=\"cursor:pointer\" (click)=\"slideToggle()\" class=\"pull-right fa fa-{{slideState==='down'?'minus':'plus'}}-circle\"></b></h3>                \n                  " + this.getPager(true) + "\n                </div>\n            <div class=\"panel-body\" style=\"overflow:auto\">            \n            ");
            }
            else {
                tpl.push("<div class=\"panel panel-" + this.options.panelMode + "\">\n            <div class=\"panel-heading\" style=\"cursor:pointer\" (click)=\"slideToggle()\">\n                <h3 class=\"panel-title\">" + this.options.title + " <b class=\"pull-right fa fa-{{slideState==='down'?'minus':'plus'}}-circle\"></b></h3>\n            </div>\n            <div class=\"panel-body\" style=\"overflow:auto\">            \n            ");
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
        tpl.push("<div class=\"filter-window\" #filterWindow>\n        <div class=\"title\" (click)=\"hideFilterWindow()\"><span>Title</span><a href=\"javascript:;\" title=\"Close filter window.\" ><b class=\"fa fa-remove\"></b></a></div>\n        <div class=\"filter-content\"></div>\n        </div>");
        if (this.options.viewMode && this.options.viewMode === "panel") {
            tpl.push('</div></div>');
        }
        return tpl.join('');
    };
    juGridBuilder.prototype.createComponentFactory = function (options) {
        var _this = this;
        this.options = options;
        var tpl = this.getTemplate();
        var type = this.createNewComponent(tpl);
        var module = this.createComponentModule(type);
        return new Promise(function (resolve) {
            _this.compiler
                .compileModuleAndAllComponentsAsync(module)
                .then(function (moduleWithFactories) {
                resolve(_.find(moduleWithFactories.componentFactories, { componentType: type }));
            });
        });
    };
    juGridBuilder.prototype.createNewComponent = function (tmpl) {
        var DynamicGridComponent = (function () {
            function DynamicGridComponent(renderer, el) {
                this.renderer = renderer;
                this.el = el;
                this.data = [];
                this.config = {};
                this.viewList = [];
                this.isColResize = false;
                this.slideState = 'down';
            }
            DynamicGridComponent.prototype.isValid = function (fieldName, index) {
                var arr = this.editors.toArray();
                if (arr.length > index) {
                    return arr[index].isValid(fieldName);
                }
                return { 'validation-msg-hide': true };
            };
            DynamicGridComponent.prototype.getValidationMsg = function (fieldName, index) {
                var arr = this.editors.toArray();
                if (arr.length > index) {
                    return arr[index].getValidationMsg(fieldName);
                }
                return '';
            };
            DynamicGridComponent.prototype.ngOnInit = function () {
                if (this.config.colResize) {
                    this.columnResizing();
                }
            };
            DynamicGridComponent.prototype.getStyle = function (tc1, tc2) {
                var style = {};
                if (tc2.offsetWidth <= tc1.offsetWidth) {
                    style.border = 0;
                    style.width = tc2.offsetWidth + 20 + 'px';
                }
                else {
                    style.border = '1px solid #ddd';
                }
                if (tc1.offsetHeight === this.config.height) {
                    style.border = '1px solid #ddd';
                }
                return style;
            };
            DynamicGridComponent.prototype.tblScroll = function (e, headerDiv) {
                headerDiv.scrollLeft = e.target.scrollLeft;
            };
            DynamicGridComponent.prototype.columnResizing = function () {
                var _this = this;
                var thList = this.el.nativeElement.querySelectorAll('table thead tr th'), mousemove$ = Rx_1.Observable.fromEvent(document, 'mousemove'), mouseup$ = Rx_1.Observable.fromEvent(document, 'mouseup'), startX = 0, w1 = 0, w2 = 0, not_mousedown = true, tblWidth = this.config.width, activeIndex = 1;
                var _loop_1 = function(index) {
                    var th = thList[index];
                    Rx_1.Observable.fromEvent(th, 'mousemove')
                        .filter(function (_) { return index !== 0; })
                        .filter(function (e) {
                        if (e.target.tagName === 'TH') {
                            if (Math.abs(e.x - jQuery(e.target).offset().left) < 7) {
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
                            document.body.style.cursor = 'col-resize';
                            not_mousedown = false;
                            activeIndex = index;
                            startX = e.x;
                            tblWidth = _this.config.width;
                            w1 = _this.config.columnDefs[index - 1].width;
                            w2 = _this.config.columnDefs[index].width;
                        });
                    })
                        .subscribe();
                };
                for (var index = 0; index < thList.length; index++) {
                    _loop_1(index);
                }
                mouseup$.subscribe(function (e) {
                    document.body.style.cursor = 'default';
                    not_mousedown = true;
                });
                mousemove$
                    .map(function (e) { return e.x - startX; })
                    .filter(function (e) { return w1 + e > 20 && !not_mousedown; })
                    .do(function (diff) { if (Math.abs(diff) > 0) {
                    _this.isColResize = true;
                } })
                    .subscribe(function (e) {
                    _this.config.columnDefs[activeIndex - 1].width = w1 + e;
                    _this.config.width = tblWidth + e;
                });
            };
            DynamicGridComponent.prototype.columnResizing__backup = function () {
                var _this = this;
                var thList = this.el.nativeElement.querySelectorAll('table thead tr th'), mousemove$ = Rx_1.Observable.fromEvent(document, 'mousemove'), mouseup$ = Rx_1.Observable.fromEvent(document, 'mouseup'), startX = 0, w1 = 0, w2 = 0, not_mousedown = true, tblWidth = this.config.width;
                var _loop_2 = function(index) {
                    var th = thList[index];
                    Rx_1.Observable.fromEvent(th, 'mousemove')
                        .filter(function (_) { return index !== 0; })
                        .filter(function (e) {
                        if (!not_mousedown) {
                            return true;
                        }
                        if (e.target.tagName === 'TH') {
                            if (Math.abs(e.x - jQuery(e.target).offset().left) < 7) {
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
                            tblWidth = _this.config.width;
                            w1 = _this.config.columnDefs[index - 1].width;
                            w2 = _this.config.columnDefs[index].width;
                        });
                    })
                        .flatMap(function (e) { return mousemove$
                        .map(function (e) { return e.x - startX; })
                        .do(function (diff) { if (Math.abs(diff) > 0) {
                        _this.isColResize = true;
                    } })
                        .takeUntil(mouseup$.do(function (e) { not_mousedown = true; })); })
                        .distinctUntilChanged()
                        .filter(function (e) { return e < 0 ? w1 + e > 20 : w2 - e > 20; })
                        .subscribe(function (e) {
                        _this.config.columnDefs[index - 1].width = w1 + e;
                        _this.config.width = tblWidth + e;
                    });
                };
                for (var index = 0; index < thList.length; index++) {
                    _loop_2(index);
                }
            };
            DynamicGridComponent.prototype.findPosX = function (obj) {
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
            DynamicGridComponent.prototype.slideToggle = function () {
                jQuery(this.el.nativeElement).find('.panel-body').slideToggle();
                this.slideState = this.slideState === 'down' ? 'up' : 'down';
            };
            DynamicGridComponent.prototype.ngOnDestroy = function () {
                this.config.columnDefs
                    .filter(function (it) { return it.filterApi; })
                    .forEach(function (it) { it.filterApi.destroy(); });
            };
            DynamicGridComponent.prototype.trackByResolver = function () {
                var _this = this;
                return function (index, obj) { return obj[_this.config.trackBy]; };
            };
            DynamicGridComponent.prototype.pagerInit = function (pager) {
                this.pager = pager;
                this.config.api.pager = pager;
                this.pager.sspFn = this.config.sspFn;
            };
            DynamicGridComponent.prototype.onFormLoad = function (form) {
                this.formObj = form;
                if (this.config.onFormLoad) {
                    this.config.onFormLoad(form);
                }
            };
            DynamicGridComponent.prototype.setSelectData = function (key, value) {
                var col = this.config.columnDefs.find(function (_) { return _.field === key; });
                col.dataSrc = value;
            };
            DynamicGridComponent.prototype.setJuSelectData = function (key, value, index) {
                this.editors.toArray()[index].setJuSelectData(key, value);
            };
            DynamicGridComponent.prototype.setData = function (data) {
                this.data = data;
                this.notifyFilter();
                this._copyOfData = data.slice();
            };
            DynamicGridComponent.prototype.onPageChange = function (list) {
                var _this = this;
                async_call(function () { _this.viewList = list; });
            };
            DynamicGridComponent.prototype.addItem = function (item) {
                this.data.unshift(item);
                this._copyOfData.unshift(item);
                this.pager.firePageChange();
                this.notifyFilter();
            };
            DynamicGridComponent.prototype.updateItem = function (item) {
            };
            DynamicGridComponent.prototype.removeItem = function (item) {
                this.data.splice(this.data.indexOf(item), 1);
                this._copyOfData.splice(this.data.indexOf(item), 1);
                this.pager.firePageChange();
                this.notifyFilter();
            };
            DynamicGridComponent.prototype.sort = function (colDef) {
                if (this.isColResize) {
                    this.isColResize = false;
                    return;
                }
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
            DynamicGridComponent.prototype.sortIcon = function (colDef) {
                var hidden = typeof colDef.reverse === 'undefined';
                return { 'fa-sort not-active': hidden, 'fa-caret-up': colDef.reverse === false, 'fa-caret-down': colDef.reverse === true };
            };
            DynamicGridComponent.prototype.filterIcon = function (colDef) {
                return { 'icon-hide': !(colDef.filterApi && colDef.filterApi.isFilterActive()), 'icon-show': colDef.filterApi && colDef.filterApi.isFilterActive() };
            };
            DynamicGridComponent.prototype.toggleChildView = function (row) {
                row.expand = !row.expand;
                if (!(row.items && row.items.length > 0) && this.config.lazyLoad) {
                    this.config.lazyLoad(row).subscribe(function (next) {
                        row.items = next;
                    });
                }
            };
            DynamicGridComponent.prototype.showFilter = function (colDef, event) {
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
            DynamicGridComponent.prototype.buildFilter = function (colDef) {
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
            DynamicGridComponent.prototype.notifyFilter = function () {
                this.config.columnDefs.forEach(function (it) {
                    if (it.filter) {
                        it.dataUpdated = true;
                    }
                });
            };
            DynamicGridComponent.prototype.valueGetter = function (colDef) {
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
            DynamicGridComponent.prototype.filterChangedCallback = function () {
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
            DynamicGridComponent.prototype.hideFilterWindow = function () {
                if (this.filterWindow) {
                    this.filterWindow.hide();
                    this.hideFilterBar();
                }
            };
            DynamicGridComponent.prototype.hideFilterBar = function () {
                if (this.currentFilter) {
                    this.currentFilter.isOpened = false;
                    this.currentFilter.filterCss = { 'icon-hide': true, 'icon-show': false };
                }
            };
            __decorate([
                core_1.ViewChildren(rowEditor_1.rowEditor), 
                __metadata('design:type', core_1.QueryList)
            ], DynamicGridComponent.prototype, "editors", void 0);
            __decorate([
                core_1.ViewChild('filterWindow'), 
                __metadata('design:type', core_1.ElementRef)
            ], DynamicGridComponent.prototype, "filterWindowRef", void 0);
            DynamicGridComponent = __decorate([
                core_1.Component({
                    selector: 'dynamic-grid',
                    template: tmpl,
                    encapsulation: core_1.ViewEncapsulation.None
                }), 
                __metadata('design:paramtypes', [core_1.Renderer, core_1.ElementRef])
            ], DynamicGridComponent);
            return DynamicGridComponent;
        }());
        return DynamicGridComponent;
    };
    juGridBuilder.prototype.createComponentModule = function (componentType) {
        var RuntimeComponentModuleForJuForm = (function () {
            function RuntimeComponentModuleForJuForm() {
            }
            RuntimeComponentModuleForJuForm = __decorate([
                core_1.NgModule({
                    imports: [
                        shared_module_1.SharedModule
                    ],
                    declarations: [
                        componentType
                    ],
                }), 
                __metadata('design:paramtypes', [])
            ], RuntimeComponentModuleForJuForm);
            return RuntimeComponentModuleForJuForm;
        }());
        return RuntimeComponentModuleForJuForm;
    };
    juGridBuilder = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [compiler_1.RuntimeCompiler])
    ], juGridBuilder);
    return juGridBuilder;
}());
exports.juGridBuilder = juGridBuilder;
function async_call(fx, time) {
    if (time === void 0) { time = 0; }
    var tid = setTimeout(function () { fx(); clearTimeout(tid); }, time);
}
//# sourceMappingURL=juGrid.builder.js.map