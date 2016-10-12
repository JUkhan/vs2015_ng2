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
const core_1 = require('@angular/core');
const compiler_1 = require('@angular/compiler');
const shared_module_1 = require('../shared.module');
const TextFilter_1 = require('./TextFilter');
const NumberFilter_1 = require('./NumberFilter');
const SetFilter_1 = require('./SetFilter');
const Rx_1 = require('rxjs/Rx');
const rowEditor_1 = require('./rowEditor');
let juGridBuilder = class juGridBuilder {
    constructor(compiler) {
        this.compiler = compiler;
        this.options = {};
        this.headerHtml = [];
        this._colIndex = 0;
        this.totalCS = 0;
    }
    getTotalWidth() {
        let totalWidth = 0;
        this.options.columnDefs.forEach(_ => {
            if (_.hide)
                return;
            _.width = _.width || 120;
            totalWidth += _.width;
        });
        return totalWidth + 25;
    }
    getPager(isHeader = false) {
        const style = isHeader ? `style="position:absolute;top:7px;left:${this.options.pagerLeftPos}px"` : '';
        return `<div ${style} [style.display]="viewList?.length?'block':'none'" class="juPager" [linkPages]="config.linkPages" [enablePowerPage]="config.enablePowerPage" [enablePageSearch]="config.enablePageSearch" [pageSize]="config.pageSize" [data]="data" (onInit)="pagerInit($event)" (pageChange)="onPageChange($event)"></div>`;
    }
    renderTable(tpl) {
        this.options.width = this.getTotalWidth();
        tpl.push(`<div [style.display]="config.message?'block':'none'" [class]="config.messageCss">{{config.message}}</div>`);
        if (this.options.pagerPos === 'top') {
            tpl.push(this.getPager());
        }
        tpl.push(`<div class="ju-grid" [ngStyle]="getStyle(tc1, tc2)">
            <div style="overflow:hidden" #headerDiv>
                <div [style.width.px]="config.width">
                    <table  class="${this.options.classNames} theader ${this.options.colResize ? 'tbl-resize' : ''}">
                        <thead>
                            ${this.getHeader(this.options.columnDefs)}
                        </thead>
                     </table>
                </div>
            </div>

            <div #tc1 style="max-height:${this.options.height}px;overflow:auto;" class="tbl-body-content" (scroll)="tblScroll($event, headerDiv)">
                <div #tc2 [style.width.px]="config.width - 22">
                    <table class="${this.options.classNames} tbody ${this.options.colResize ? 'tbl-resize' : ''}">
                        <tbody (click)="hideFilterWindow()">
                            ${this.options.enableCellEditing ? this.getCellEditingView() : this.options.enableTreeView ? this.getTreeView() : this.getPlainView()}
                        </tbody>
                    </table>
                </div>
            </div>            
        </div>`);
        if (this.options.pagerPos === 'bottom') {
            tpl.push('<div style="height:5px;"></div>');
            tpl.push(this.getPager());
        }
    }
    getCellEditingView() {
        let tpl = [];
        tpl.push(`<tr ${this.options.rowEvents} [ngClass]="config.trClass(row, i, f, l)" [model]="row" [config]="config" class="row-editor" *ngFor="let row of viewList;${this.options.trackBy ? 'trackBy:trackByResolver();' : ''}let i = index;let f=first;let l = last">`);
        this.options.columnDefs.forEach((item, index) => {
            if (item.hide)
                return;
            this.getCell(item, `config.columnDefs[${index}]`, tpl, index);
        });
        tpl.push('</tr>');
        return tpl.join('');
    }
    getDataExpression(item, config) {
        if (!item.dataSrc) {
            item.dataSrc = [];
        }
        return `${config}.dataSrc`;
    }
    getCell(item, config, tpl, index) {
        var style = '', change = '', validation = '', header = '', rowHeight = this.options.rowHeight > 0 ? `style="height:${this.options.rowHeight}px"` : '';
        if (item.type) {
            if (item.validators) {
                validation = ` <i [ngClass]="isValid('${item.field}', i)" class="validation fa fa-info-circle" [title]="getValidationMsg('${item.field}', i)"></i>`;
            }
            item.width = item.width || 120;
            style = item.width ? `style="display:inline-block;" [style.width.px]="(config.columnDefs[${index}].width-(isValid('${item.field}', i)['validation-msg-hide']?18:40))"` : '';
            item.headerName = item.headerName || '';
            header = item.headerName.replace(/(<([^>]+)>)/ig, '');
            switch (item.type) {
                case 'juSelect':
                    change = item.change ? ` (option-change)="${config}.change($event)"` : '';
                    tpl.push(`<td ${rowHeight} [style.width.px]="config.columnDefs[${index}].width"><div ${style}>
                    <juSelect 
                        ${change} 
                        [config]="${config}"
                        [model]="row"
                        [value]="row['${item.field}']"                        
                        property-name="${item.field}"                       
                        [data]="${this.getDataExpression(item, config)}"
                        [options]="${config}.options||{}"
                        [index]="i"                        
                    >
                    </juSelect></div>`);
                    tpl.push(validation);
                    tpl.push('</td>');
                    break;
                case 'select':
                    change = item.change ? `(change)="${config}.change(row, i)"` : '';
                    tpl.push(`<td ${rowHeight} [style.width.px]="config.columnDefs[${index}].width"><select ${style} ${change} class="select form-control" [(ngModel)]="row.${item.field}" >
                            <option value="">{{${config}.emptyOptionText||'Select option'}}</option>
                            <option *ngFor="let v of ${this.getDataExpression(item, config)}" [value]="v.value">{{v.name}}</option>
                        </select>`);
                    tpl.push(validation);
                    tpl.push('</td>');
                    break;
                case 'html':
                    tpl.push(`<td ${rowHeight} [style.width.px]="config.columnDefs[${index}].width">${item.content}</td>`);
                    break;
                case 'datepicker':
                    tpl.push(`<td ${rowHeight} [style.width.px]="config.columnDefs[${index}].width"><div ${style}>
                    <div class="input-group date" [pickers]="${config}.config" picker-name="${item.type}" [model]="row" property="${item.field}" [config]="${config}" [form]="myForm" >
                        <input type="text" [disabled]="${config}.disabled" [(ngModel)]="row.${item.field}" class="form-control" placeholder="Enter ${header}">
                        <span class="input-group-addon">
                            <span class="fa fa-calendar"></span>
                        </span>
                    </div></div>`);
                    tpl.push(validation);
                    tpl.push('</td>');
                    break;
                case 'text':
                case 'number':
                    tpl.push(`<td ${rowHeight} [style.width.px]="config.columnDefs[${index}].width"><div ${style}><input ${style} class="text form-control" type="${item.type}" [(ngModel)]="row.${item.field}" placeholder="Enter ${header}">`);
                    tpl.push('</div>');
                    tpl.push(validation);
                    tpl.push('</td>');
                    break;
                case 'textarea':
                    tpl.push(`<td ${rowHeight} [style.width.px]="config.columnDefs[${index}].width"><div ${style}><textarea ${style} class="text form-control" type="${item.type}" [(ngModel)]="row.${item.field}" placeholder="Enter ${header}"></textarea>`);
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
    }
    getPlainView() {
        let tpl = [];
        tpl.push(`<tr ${this.options.rowEvents} [ngClass]="config.trClass(row, i, f, l)" *ngFor="let row of viewList;${this.options.trackBy ? 'trackBy:trackByResolver();' : ''}let i = index;let f=first;let l = last">`);
        this.options.columnDefs.forEach((item, index) => {
            if (item.hide)
                return;
            tpl.push(this.getNormalTD(item, index));
        });
        tpl.push('</tr>');
        return tpl.join('');
    }
    getNormalTD(item, index) {
        let tpl = [], rowHeight = this.options.rowHeight > 0 ? `style="height:${this.options.rowHeight}px"` : '';
        tpl.push('<td ' + `${rowHeight} [title]="row.${item.field}" `);
        if (item.width) {
            tpl.push(`[style.width.px]="config.columnDefs[${index}].width"`);
        }
        if (item.tdClass) {
            tpl.push(`[ngClass]="config.columnDefs[${index}].tdClass(row, i, f, l)"`);
        }
        if (item.action) {
            tpl.push('>');
            item.action.forEach((ac, aci) => {
                if (item.headerName === 'crud') {
                    if (ac.enable == true) {
                        tpl.push(`<a href="javascript:;" title="${ac.title}" (click)="config.columnDefs[${index}].action[${aci}].click(row)"><b class="${ac.icon}"></b></a> `);
                    }
                }
                else {
                    tpl.push(`<a href="javascript:;" title="${ac.title}" (click)="config.columnDefs[${index}].action[${aci}].click(row)"><b class="${ac.icon}"></b></a> `);
                }
            });
        }
        else if (item.cellRenderer) {
            tpl.push(` [innerHTML]="config.columnDefs[${index}].cellRenderer(row,i,f, l)">`);
        }
        else if (item.exp) {
            tpl.push(`>${item.exp}`);
        }
        else if (item.field) {
            tpl.push(`>{{row.${item.field}}}`);
        }
        else {
            tpl.push(`>`);
        }
        tpl.push('</td>');
        return tpl.join('');
    }
    getParams(row, level) {
        return level === 0 ? `${row}, i, f, l` : `${row}, i${level}, f${level}, l${level}`;
    }
    getLevel(index, level) {
        return index === 0 ? `class="level-${level}"` : '';
    }
    renderTr(row, level, previousChild = 'row') {
        let tpl = [];
        if (level > 0) {
            tpl.push(`<template [ngIf]="${previousChild}.expand">`);
            tpl.push(`<template ngFor let-${row} [ngForOf]="${previousChild}.items" let-i${level}="index" let-f${level}="first" let-l${level}="last" ${this.options.trackBy ? '[ngForTrackBy]="trackByResolver()"' : ''}>`);
        }
        tpl.push(`<tr ${this.options.rowEvents} [ngClass]="config.trClass(${this.getParams(row, level)})">`);
        this.options.columnDefs.forEach((item, index) => {
            if (item.hide)
                return;
            tpl.push(`<td [style.width.px]="config.columnDefs[${index}].width" ${this.getLevel(index, level)}`);
            if (item.tdClass) {
                tpl.push(`[ngClass]="config.columnDefs[${index}].tdClass(${this.getParams(row, level)})"`);
            }
            if (item.action) {
                tpl.push('>');
                if (index === 0) {
                    tpl.push(`<a *ngIf="${row}.hasChild||${row}.items" href="javascript:;" (click)="toggleChildView(${row})" title="Toggling for child view."><b class="fa fa-{{${row}.expand?'minus':'plus'}}-square-o"></b></a>`);
                }
                item.action.forEach((ac, aci) => {
                    if (item.headerName === 'crud') {
                        if (ac.enable == true) {
                            tpl.push(` <a href="javascript:;" title="${ac.title}" (click)="config.columnDefs[${index}].action[${aci}].click(${row})"><b class="${ac.icon}"></b></a> `);
                        }
                    }
                    else {
                        tpl.push(` <a href="javascript:;" title="${ac.title}" (click)="config.columnDefs[${index}].action[${aci}].click(${row})"><b class="${ac.icon}"></b></a> `);
                    }
                });
            }
            else if (item.cellRenderer) {
                if (index === 0) {
                    tpl.push(`><a *ngIf="${row}.hasChild||${row}.items" href="javascript:;" (click)="toggleChildView(${row})" title="Toggling for child view."><b class="fa fa-{{${row}.expand?'minus':'plus'}}-square-o"></b></a>
                 <span class="child-renderer" [innerHTML]="config.columnDefs[${index}].cellRenderer(${this.getParams(row, level)})"></span>`);
                }
                else {
                    tpl.push(` [innerHTML]="config.columnDefs[${index}].cellRenderer(${this.getParams(row, level)})">`);
                }
            }
            else if (item.field) {
                let exp = item.exp ? item.exp : `{{${row}.${item.field}}}`;
                if (index === 0) {
                    tpl.push(`><a *ngIf="${row}.hasChild||${row}.items" href="javascript:;" (click)="toggleChildView(${row})" title="Toggling for child view."><b class="fa fa-{{${row}.expand?'minus':'plus'}}-square-o"></b></a>
                        ${exp}`);
                }
                else {
                    tpl.push(`>${exp}`);
                }
            }
            else {
                tpl.push(`>`);
            }
            tpl.push('</td>');
        });
        tpl.push('</tr>');
        return tpl.join('');
    }
    getTreeView() {
        let tpl = [];
        tpl.push(`<template ngFor let-row [ngForOf]="viewList" let-i="index" let-f="first" let-l="last" ${this.options.trackBy ? '[ngForTrackBy]="trackByResolver()"' : ''}>`);
        tpl.push(this.renderTr('row', 0));
        tpl.push(this.renderTr('child1', 1, 'row'));
        let temp = [];
        for (let i = 2; i <= this.options.level; i++) {
            tpl.push(this.renderTr('child' + i, i, 'child' + (i - 1)));
            temp.push('</template></template>');
        }
        tpl.push(temp.join(''));
        tpl.push('</template>');
        tpl.push('</template>');
        tpl.push('</template>');
        return tpl.join('');
    }
    getHeader(hederDef) {
        this._colIndex = 0;
        var colDef = [], rc = this.row_count(hederDef), i = 0;
        while (i < rc) {
            this.headerHtml[i] = [];
            i++;
        }
        hederDef.forEach((it, i) => {
            this._colIndex = i;
            if (it.hide)
                return;
            this.traverseCell(it, rc, 0, colDef);
        });
        if (rc > 1) {
            this.options.columnDefs = colDef;
        }
        return this.headerHtml.map(_ => `<tr>${_.join('')}</tr>`).reduce((p, c) => p + c, '');
    }
    traverseCell(cell, rs, headerRowFlag, colDef) {
        if (cell.children) {
            this.headerHtml[headerRowFlag].push('<th');
            if (cell.children.length > 1) {
                this.totalCS = 0;
                this.getColSpan(cell);
                this.headerHtml[headerRowFlag].push(` colspan="${this.totalCS}"`);
            }
            this.headerHtml[headerRowFlag].push(`>${cell.headerName}</th>`);
            headerRowFlag++;
            let rc = rs, hf = headerRowFlag;
            for (var i = 0; i < cell.children.length; i++) {
                this.traverseCell(cell.children[i], --rs, headerRowFlag, colDef);
                rs = rc;
            }
        }
        else {
            colDef.push(cell);
            let rh = this.options.headerHeight > 0 ? `style="height:${this.options.headerHeight}px"` : '';
            this.headerHtml[headerRowFlag].push(`<th ${rh} `);
            if (rs > 1) {
                this.headerHtml[headerRowFlag].push(` valign="bottom" rowspan="${rs}"`);
            }
            if (cell.width) {
                console.log();
                this.headerHtml[headerRowFlag].push(` [style.width.px]="config.columnDefs[${this._colIndex}].width"`);
            }
            if (cell.sort) {
                this.headerHtml[headerRowFlag].push(` (click)="sort(config.columnDefs[${this._colIndex}])"`);
            }
            if (cell.filter) {
                this.headerHtml[headerRowFlag].push(` (mouseenter)="config.columnDefs[${this._colIndex}].filterCss={'icon-hide':false,'icon-show':true}"`);
                this.headerHtml[headerRowFlag].push(` (mouseleave)="config.columnDefs[${this._colIndex}].filterCss={'icon-hide':!config.columnDefs[${this._colIndex}].isOpened,'icon-show':config.columnDefs[${this._colIndex}].isOpened}"`);
            }
            if (cell.headerName === 'crud' && cell.enable) {
                this.headerHtml[headerRowFlag].push(`><a href="javascript:;" title="New item" (click)="config.newItem()"><b class="fa fa-plus-circle"></b> </a></th>`);
            }
            else {
                this.headerHtml[headerRowFlag].push(' >');
                if (cell.sort) {
                    this.headerHtml[headerRowFlag].push(`<b [ngClass]="sortIcon(config.columnDefs[${this._colIndex}])" class="fa"></b>`);
                }
                if (cell.filter) {
                    this.headerHtml[headerRowFlag].push(` <b [ngClass]="filterIcon(config.columnDefs[${this._colIndex}])" class="fa fa-filter"></b>`);
                }
                this.headerHtml[headerRowFlag].push(` <span>${cell.headerName}</span>`);
                if (cell.filter) {
                    this.headerHtml[headerRowFlag].push(`<a href="javascript:;" title="Show filter window." [ngClass]="config.columnDefs[${this._colIndex}].filterCss" (click)="showFilter(config.columnDefs[${this._colIndex}], $event)" class="filter-bar icon-hide"><b class="fa fa-filter"></b></a>`);
                }
                this.headerHtml[headerRowFlag].push('</th>');
            }
        }
    }
    row_count(hederDef) {
        var max = 0;
        for (var i = 0; i < hederDef.length; i++) {
            max = Math.max(max, this.cal_header_row(hederDef[i], 1));
        }
        return max;
    }
    cal_header_row(cell, row_count) {
        var max = row_count;
        if (cell.children) {
            row_count++;
            for (var i = 0; i < cell.children.length; i++) {
                max = Math.max(max, this.cal_header_row(cell.children[i], row_count));
            }
        }
        return max;
    }
    getColSpan(cell) {
        if (cell.children) {
            cell.children.forEach(it => {
                this.totalCS++;
                this.getColSpanHelper(it);
            });
        }
    }
    getColSpanHelper(cell) {
        if (cell.children) {
            this.totalCS--;
            cell.children.forEach(it => {
                this.totalCS++;
                this.getColSpan(it);
            });
        }
    }
    getTemplate() {
        var tpl = [];
        if (this.options.viewMode && this.options.viewMode === "panel") {
            if (this.options.pagerPos === 'header') {
                tpl.push(`<div class="panel panel-${this.options.panelMode}">
            <div class="panel-heading" style="position:relative">
                <h3 class="panel-title">${this.options.title} <b style="cursor:pointer" (click)="slideToggle()" class="pull-right fa fa-{{slideState==='down'?'minus':'plus'}}-circle"></b></h3>                
                  ${this.getPager(true)}
                </div>
            <div class="panel-body" style="overflow:auto">            
            `);
            }
            else {
                tpl.push(`<div class="panel panel-${this.options.panelMode}">
            <div class="panel-heading" style="cursor:pointer" (click)="slideToggle()">
                <h3 class="panel-title">${this.options.title} <b class="pull-right fa fa-{{slideState==='down'?'minus':'plus'}}-circle"></b></h3>
            </div>
            <div class="panel-body" style="overflow:auto">            
            `);
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
        tpl.push(`<div class="filter-window" #filterWindow>
        <div class="title" (click)="hideFilterWindow()"><span>Title</span><a href="javascript:;" title="Close filter window." ><b class="fa fa-remove"></b></a></div>
        <div class="filter-content"></div>
        </div>`);
        if (this.options.viewMode && this.options.viewMode === "panel") {
            tpl.push('</div></div>');
        }
        return tpl.join('');
    }
    createComponentFactory(options) {
        this.options = options;
        const tpl = this.getTemplate();
        const type = this.createNewComponent(tpl);
        const module = this.createComponentModule(type);
        return new Promise((resolve) => {
            this.compiler
                .compileModuleAndAllComponentsAsync(module)
                .then((moduleWithFactories) => {
                resolve(_.find(moduleWithFactories.componentFactories, { componentType: type }));
            });
        });
    }
    createNewComponent(tmpl) {
        let DynamicGridComponent = class DynamicGridComponent {
            constructor(renderer, el) {
                this.renderer = renderer;
                this.el = el;
                this.data = [];
                this.config = {};
                this.viewList = [];
                this.isColResize = false;
                this.slideState = 'down';
            }
            isValid(fieldName, index) {
                let arr = this.editors.toArray();
                if (arr.length > index) {
                    return arr[index].isValid(fieldName);
                }
                return { 'validation-msg-hide': true };
            }
            getValidationMsg(fieldName, index) {
                let arr = this.editors.toArray();
                if (arr.length > index) {
                    return arr[index].getValidationMsg(fieldName);
                }
                return '';
            }
            ngOnInit() {
                if (this.config.colResize) {
                    this.columnResizing();
                }
            }
            getStyle(tc1, tc2) {
                let style = {};
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
            }
            tblScroll(e, headerDiv) {
                headerDiv.scrollLeft = e.target.scrollLeft;
            }
            columnResizing() {
                let thList = this.el.nativeElement.querySelectorAll('table thead tr th'), mousemove$ = Rx_1.Observable.fromEvent(document, 'mousemove'), mouseup$ = Rx_1.Observable.fromEvent(document, 'mouseup'), startX = 0, w1 = 0, w2 = 0, not_mousedown = true, tblWidth = this.config.width, activeIndex = 1;
                for (let index = 0; index < thList.length; index++) {
                    let th = thList[index];
                    Rx_1.Observable.fromEvent(th, 'mousemove')
                        .filter(_ => index !== 0)
                        .filter((e) => {
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
                        .flatMap((e) => {
                        return Rx_1.Observable.fromEvent(e.target, 'mousedown')
                            .do((e) => {
                            document.body.style.cursor = 'col-resize';
                            not_mousedown = false;
                            activeIndex = index;
                            startX = e.x;
                            tblWidth = this.config.width;
                            w1 = this.config.columnDefs[index - 1].width;
                            w2 = this.config.columnDefs[index].width;
                        });
                    })
                        .subscribe();
                }
                mouseup$.subscribe(e => {
                    document.body.style.cursor = 'default';
                    not_mousedown = true;
                });
                mousemove$
                    .map((e) => e.x - startX)
                    .filter(e => w1 + e > 20 && !not_mousedown)
                    .do(diff => { if (Math.abs(diff) > 0) {
                    this.isColResize = true;
                } })
                    .subscribe(e => {
                    this.config.columnDefs[activeIndex - 1].width = w1 + e;
                    this.config.width = tblWidth + e;
                });
            }
            columnResizing__backup() {
                let thList = this.el.nativeElement.querySelectorAll('table thead tr th'), mousemove$ = Rx_1.Observable.fromEvent(document, 'mousemove'), mouseup$ = Rx_1.Observable.fromEvent(document, 'mouseup'), startX = 0, w1 = 0, w2 = 0, not_mousedown = true, tblWidth = this.config.width;
                for (let index = 0; index < thList.length; index++) {
                    let th = thList[index];
                    Rx_1.Observable.fromEvent(th, 'mousemove')
                        .filter(_ => index !== 0)
                        .filter((e) => {
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
                        .flatMap((e) => {
                        return Rx_1.Observable.fromEvent(e.target, 'mousedown')
                            .do((e) => {
                            not_mousedown = false;
                            startX = e.x;
                            tblWidth = this.config.width;
                            w1 = this.config.columnDefs[index - 1].width;
                            w2 = this.config.columnDefs[index].width;
                        });
                    })
                        .flatMap(e => mousemove$
                        .map((e) => e.x - startX)
                        .do(diff => { if (Math.abs(diff) > 0) {
                        this.isColResize = true;
                    } })
                        .takeUntil(mouseup$.do(e => { not_mousedown = true; })))
                        .distinctUntilChanged()
                        .filter(e => e < 0 ? w1 + e > 20 : w2 - e > 20)
                        .subscribe(e => {
                        this.config.columnDefs[index - 1].width = w1 + e;
                        this.config.width = tblWidth + e;
                    });
                }
            }
            findPosX(obj) {
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
            }
            slideToggle() {
                jQuery(this.el.nativeElement).find('.panel-body').slideToggle();
                this.slideState = this.slideState === 'down' ? 'up' : 'down';
            }
            ngOnDestroy() {
                this.config.columnDefs
                    .filter(it => it.filterApi)
                    .forEach(it => { it.filterApi.destroy(); });
            }
            trackByResolver() {
                return (index, obj) => obj[this.config.trackBy];
            }
            pagerInit(pager) {
                this.pager = pager;
                this.config.api.pager = pager;
                this.pager.sspFn = this.config.sspFn;
            }
            onFormLoad(form) {
                this.formObj = form;
                if (this.config.onFormLoad) {
                    this.config.onFormLoad(form);
                }
            }
            setSelectData(key, value) {
                let col = this.config.columnDefs.find(_ => _.field === key);
                col.dataSrc = value;
            }
            setJuSelectData(key, value, index) {
                this.editors.toArray()[index].setJuSelectData(key, value);
            }
            setData(data) {
                this.data = data;
                this.notifyFilter();
                this._copyOfData = [...data];
            }
            onPageChange(list) {
                async_call(() => { this.viewList = list; });
            }
            addItem(item) {
                this.data.unshift(item);
                this._copyOfData.unshift(item);
                this.pager.firePageChange();
                this.notifyFilter();
            }
            updateItem(item) {
            }
            removeItem(item) {
                this.data.splice(this.data.indexOf(item), 1);
                this._copyOfData.splice(this.data.indexOf(item), 1);
                this.pager.firePageChange();
                this.notifyFilter();
            }
            sort(colDef) {
                if (this.isColResize) {
                    this.isColResize = false;
                    return;
                }
                colDef.reverse = !(typeof colDef.reverse === 'undefined' ? true : colDef.reverse);
                this.config.columnDefs.forEach(_ => {
                    if (_ !== colDef) {
                        _.reverse = undefined;
                    }
                });
                if (this.config.sspFn) {
                    this.pager.sort(colDef.field, colDef.reverse);
                    return;
                }
                let reverse = !colDef.reverse ? 1 : -1, sortFn = typeof colDef.comparator === 'function' ?
                        (a, b) => reverse * colDef.comparator(a, b) :
                    function (a, b) { return a = a[colDef.field], b = b[colDef.field], reverse * ((a > b) - (b > a)); };
                this.data = [...this.data.sort(sortFn)];
            }
            sortIcon(colDef) {
                let hidden = typeof colDef.reverse === 'undefined';
                return { 'fa-sort not-active': hidden, 'fa-caret-up': colDef.reverse === false, 'fa-caret-down': colDef.reverse === true };
            }
            filterIcon(colDef) {
                return { 'icon-hide': !(colDef.filterApi && colDef.filterApi.isFilterActive()), 'icon-show': colDef.filterApi && colDef.filterApi.isFilterActive() };
            }
            toggleChildView(row) {
                row.expand = !row.expand;
                if (!(row.items && row.items.length > 0) && this.config.lazyLoad) {
                    this.config.lazyLoad(row).subscribe(next => {
                        row.items = next;
                    });
                }
            }
            showFilter(colDef, event) {
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
                let parent = jQuery(event.target).parents('th'), parentOffset = parent.offset();
                this.buildFilter(colDef);
                this.filterWindow.find('.filter-content').html(colDef.filterApi.getGui());
                this.filterWindow.find('.title span').html(colDef.headerName);
                this.filterWindow.css({ top: parentOffset.top + parent.height() + 7, left: parentOffset.left }).show();
            }
            buildFilter(colDef) {
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
                            .map(item => {
                            return colDef.params.valueGetter ? colDef.params.valueGetter(item) : item[colDef.field];
                        }).filter((value, index, self) => self.indexOf(value) === index);
                        colDef.filterApi.bindData(colDef.filterApi.data);
                        colDef.dataUpdted = false;
                    }
                }
                catch (e) {
                    console.error(e.message);
                }
            }
            notifyFilter() {
                this.config.columnDefs.forEach(it => {
                    if (it.filter) {
                        it.dataUpdated = true;
                    }
                });
            }
            valueGetter(colDef) {
                try {
                    if (colDef.params.valueGetter) {
                        return colDef.params.valueGetter(colDef.row);
                    }
                    return colDef.row[colDef.field];
                }
                catch (e) {
                    console.error(e.message);
                }
            }
            filterChangedCallback() {
                let activeFilters = this.config.columnDefs.filter(it => it.filterApi && it.filterApi.isFilterActive());
                if (this.config.sspFn) {
                    let filter = activeFilters.map(_ => ({ field: _.field, searchCategory: _.filterApi.searchCategory, searchText: _.filterApi.searchText }));
                    this.pager.filter(filter);
                    return;
                }
                let temp = [];
                this._copyOfData.forEach(row => {
                    let flag = true;
                    activeFilters.forEach((col, index) => {
                        col.row = row;
                        flag &= col.filterApi.doesFilterPass(col);
                    });
                    if (flag) {
                        temp.push(row);
                    }
                });
                this.data = temp;
            }
            hideFilterWindow() {
                if (this.filterWindow) {
                    this.filterWindow.hide();
                    this.hideFilterBar();
                }
            }
            hideFilterBar() {
                if (this.currentFilter) {
                    this.currentFilter.isOpened = false;
                    this.currentFilter.filterCss = { 'icon-hide': true, 'icon-show': false };
                }
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
    }
    createComponentModule(componentType) {
        let RuntimeComponentModuleForJuForm = class RuntimeComponentModuleForJuForm {
        };
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
    }
};
juGridBuilder = __decorate([
    core_1.Injectable(), 
    __metadata('design:paramtypes', [compiler_1.RuntimeCompiler])
], juGridBuilder);
exports.juGridBuilder = juGridBuilder;
function async_call(fx, time = 0) {
    let tid = setTimeout(() => { fx(); clearTimeout(tid); }, time);
}

//# sourceMappingURL=juGrid.builder.js.map
