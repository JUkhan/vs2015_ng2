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
var shared_module_1 = require('../../../app/shared/shared.module');
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
            _.width = _.width || 120;
            totalWidth += _.width;
        });
        return totalWidth + 25;
    };
    juGridBuilder.prototype.renderTable = function (tpl) {
        tpl.push("<div [style.display]=\"config.message?'block':'none'\" [class]=\"config.messageCss\">{{config.message}}</div>");
        if (this.options.pagerPos === 'top') {
            tpl.push("<div [style.display]=\"viewList?.length?'block':'none'\" class=\"juPager\" [linkPages]=\"config.linkPages\" [pageSize]=\"config.pageSize\" [data]=\"data\" (onInit)=\"pagerInit($event)\" (pageChange)=\"onPageChange($event)\"></div>");
        }
        tpl.push("<div class=\"ju-grid\" [ngStyle]=\"getStyle(tc1, tc2)\">\n            <div style=\"overflow:hidden\" #headerDiv>\n                <div style=\"width:" + this.getTotalWidth() + "px;\">\n                    <table  class=\"" + this.options.classNames + " theader " + (this.options.colResize ? 'tbl-resize' : '') + "\">\n                        <thead>\n                            " + this.getHeader(this.options.columnDefs) + "\n                        </thead>\n                     </table>\n                </div>\n            </div>\n\n            <div #tc1 style=\"max-height:" + this.options.height + "px;overflow:auto;\" itemscope (scroll)=\"tblScroll($event, headerDiv)\">\n                <div #tc2 style=\"width:" + (this.getTotalWidth() - 22) + "px\">\n                    <table class=\"" + this.options.classNames + " tbody " + (this.options.colResize ? 'tbl-resize' : '') + "\">\n                        <tbody (click)=\"hideFilterWindow()\">\n                            " + (this.options.enableCellEditing ? this.getCellEditingView() : this.options.enableTreeView ? this.getTreeView() : this.getPlainView()) + "\n                        </tbody>\n                    </table>\n                </div>\n            </div>            \n        </div>");
        if (this.options.pagerPos === 'bottom') {
            tpl.push('<div style="height:5px;"></div>');
            tpl.push("<div [style.display]=\"viewList?.length?'block':'none'\" class=\"juPager\" [linkPages]=\"config.linkPages\" [pageSize]=\"config.pageSize\" [data]=\"data\" (onInit)=\"pagerInit($event)\" (pageChange)=\"onPageChange($event)\"></div>");
        }
    };
    juGridBuilder.prototype.getCellEditingView = function () {
        var _this = this;
        var tpl = [];
        tpl.push("<tr " + this.options.rowEvents + " [ngClass]=\"config.trClass(row, i, f, l)\" [model]=\"row\" [config]=\"config\" class=\"row-editor\" *ngFor=\"let row of viewList;" + (this.options.trackBy ? 'trackBy:trackByResolver();' : '') + "let i = index;let f=first;let l = last\">");
        this.options.columnDefs.forEach(function (item, index) {
            _this.getCell(item, "config.columnDefs[" + index + "]", tpl, index);
        });
        tpl.push('</tr>');
        return tpl.join('');
    };
    juGridBuilder.prototype.getDataExpression = function (item, config) {
        if (!item.dataSrc) {
            item.dataSrc = [];
        }
        if (Array.isArray(item.dataSrc)) {
            return config + ".dataSrc";
        }
        return config + ".dataSrc() | async";
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
    juGridBuilder.prototype.getPlainView = function () {
        var _this = this;
        var tpl = [];
        tpl.push("<tr " + this.options.rowEvents + " [ngClass]=\"config.trClass(row, i, f, l)\" *ngFor=\"let row of viewList;" + (this.options.trackBy ? 'trackBy:trackByResolver();' : '') + "let i = index;let f=first;let l = last\">");
        this.options.columnDefs.forEach(function (item, index) {
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
            this._colIndex++;
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
                tpl.push("<div class=\"panel panel-" + this.options.panelMode + "\">\n            <div class=\"panel-heading\" style=\"position:relative\">\n                <h3 class=\"panel-title\">" + this.options.title + " <b style=\"cursor:pointer\" (click)=\"slideToggle()\" class=\"pull-right fa fa-{{slideState==='down'?'minus':'plus'}}-circle\"></b></h3>\n                <div style=\"position:absolute;top:7px;left:" + this.options.pagerLeftPos + "px\" [style.display]=\"viewList?.length?'block':'none'\" class=\"juPager\" [linkPages]=\"config.linkPages\" [pageSize]=\"config.pageSize\" [data]=\"data\" (onInit)=\"pagerInit($event)\" (pageChange)=\"onPageChange($event)\"></div>\n                </div>\n            <div class=\"panel-body\" style=\"overflow:auto\">            \n            ");
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
            function DynamicGridComponent(el) {
                this.el = el;
            }
            DynamicGridComponent.prototype.ngOnInit = function () {
            };
            DynamicGridComponent = __decorate([
                core_1.Component({
                    selector: 'dynamic-grid',
                    template: tmpl,
                }), 
                __metadata('design:paramtypes', [core_1.ElementRef])
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
//# sourceMappingURL=juGrig.builder.js.map