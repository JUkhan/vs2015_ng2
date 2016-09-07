import {Component,
    OnInit,
    OnChanges,
    ChangeDetectionStrategy,
    ContentChildren,
    QueryList,
    ResolvedReflectiveBinding,
    OnDestroy,
    ViewContainerRef,
    Input,
    Output,
    EventEmitter,
    //ChangeDetectorRef,
    Renderer,
    ViewChild,
    ViewChildren,
    ComponentRef,
    ElementRef,
    trigger,
    state,
    style,
    transition,
    animate,
    DynamicComponentLoader,
    ViewEncapsulation}      from '@angular/core';
import {juForm}             from '../juForm/juForm';
import {juPager}            from '../juPager/juPager';
import {TextFilter}         from './TextFilter';
import {NumberFilter}       from './NumberFilter';
import {SetFilter}          from './SetFilter';
import {Observable,
         Subscription}      from 'rxjs/Rx';
import {rowEditor}          from './rowEditor';

declare var jQuery: any;
@Component({
    moduleId: module.id,
    selector: '.juGrid, [juGrid], juGrid',
    templateUrl: './juGrid.html',
    styleUrls: ['./juGrid.css'],  
    //directives: [juForm], 
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default
})

export class juGrid implements OnInit, OnChanges, OnDestroy {
    @Input() options: any = {};
    private _oldItem: any = null;
    private _updtedItem: any = null;
    private _searchInActive: boolean = false;
    @Input() data = [];
    @Output() onLoad = new EventEmitter();
    private appRef: any
    dynamicComponent: ComponentRef<any>;
    @Input() viewMode;
    @Input() title;
    @Input('panelMode') panelMode: string = 'primary';
    constructor(
        private _elementRef: ElementRef,
        private loader: DynamicComponentLoader,
        //private cd: ChangeDetectorRef,         
        private viewContainerRef: ViewContainerRef
    ) { }
    ngOnChanges(changes) {
        if (this.dynamicComponent) {
            this.dynamicComponent.instance.setData(this.data);
        }
    }
    addItem(item: any) {
        if (this.dynamicComponent) {
            if (this._searchInActive) {
                this.data.unshift(item);
            }
            this.dynamicComponent.instance.addItem(item);
            //this.cd.markForCheck();
        }
    }
    getData()
    {
        return this.data.length ? this.data:this.dynamicComponent.instance.viewList;
    }
    showMessage(message: string, messageCss: string = 'alert alert-info') {
        this._updateRecord();
        this.options.message = message;
        this.options.messageCss = messageCss;
        //this.cd.markForCheck();
        if (this.dynamicComponent && this.dynamicComponent.instance) {
            this.dynamicComponent.instance.showMessage(message, messageCss);
        }
        async_call(() => {
            this.options.message = '';
            //this.cd.markForCheck();
            if (this.dynamicComponent) {
                this.dynamicComponent.instance.showMessage('', messageCss);
            }
        });
    }
    _updateRecord() {
        if (this._oldItem && this._updtedItem) {
            for (let prop in this._updtedItem) {
                this._oldItem[prop] = this._updtedItem[prop];
            }
        }
    }
    removeItem(item: any) {
        if (this.dynamicComponent) {
            if (this._searchInActive) {
                this.data.splice(this.data.indexOf(item), 1);
            }
            this.dynamicComponent.instance.removeItem(item);
            //this.cd.markForCheck();
        }
    }
    ngOnInit()
    {
        this.options.pagerPos = this.options.pagerPos || 'top';
        this.options.pagerLeftPos = this.options.pagerLeftPos || 200;
        this.options.height = this.options.height || 500;
        if (!this.options) {
            return;
        }
        if (!('linkPages' in this.options)) {
            this.options.linkPages = 10;
        }
        if (!('pageSize' in this.options)) {
            this.options.pageSize = 10;
        }
        if (!('confirmMessage' in this.options)) {
            this.options.confirmMessage = 'Are you sure to remove this item?';
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
            this.options.trClass = () => null;
        }
        if (!('level' in this.options)) {
            this.options.level = 5;
        }
        this.options.rowEvents = this.options.rowEvents || '';

        if (this.options.crud) {
            this.options.newItem = () => {
                this._oldItem = null;
                this._updtedItem = null;
                this.options.message = '';
                this.dynamicComponent.instance.formObj.isUpdate = false;
                this.dynamicComponent.instance.formObj.refresh();
                this.dynamicComponent.instance.formObj.showModal();
                if (this.options.insert_CB) {
                    this.options.insert_CB(this.dynamicComponent.instance.formObj);
                }
            };
            this.options.columnDefs.unshift({
                headerName: 'crud', width: 50, enable: this.options.create,
                action: [{
                    enable: this.options.update, title: 'Edit', icon: 'fa fa-pencil', click: (data) => {
                        this._oldItem = data;
                        this._updtedItem = Object.assign({}, data);
                        this.options.message = '';
                        this.dynamicComponent.instance.formObj.isUpdate = true;
                        this.dynamicComponent.instance.formObj.setModel(this._updtedItem);
                        this.dynamicComponent.instance.formObj.showModal();
                        if (this.options.update_CB) {
                            this.options.update_CB(this.dynamicComponent.instance.formObj, this._updtedItem);
                        }
                    }
                }, {
                        enable: this.options.remove, title: 'Remove', icon: 'fa fa-remove', click: (data) => {
                            if (confirm(this.options.confirmMessage)) {
                                this._oldItem = null;
                                this._updtedItem = null;
                                if (this.options.removeItem) {
                                    this.options.removeItem(data);
                                }
                            }
                        }
                    }]
            });
        }
        this.loadComponent();
        this.options.api = { grid: this, form: null };
    }
    private loadComponent() {
        this.loader.loadNextToLocation(getComponent(this.getDynamicConfig()), this.viewContainerRef)
            .then(com => {
                this.dynamicComponent = com;
                com.instance.config = this.options;
                if (this.options.data || this.data) {
                    this.dynamicComponent.instance.setData(this.data || this.options.data);
                }
                if (!this.options.crud) {
                    async_call(() => { this.onLoad.emit(this); });
                }
                return com;
            });

    }
    ngOnDestroy() {
        if (this.dynamicComponent) {
            this.dynamicComponent.destroy();
        }
    }

    getUpdatedRecords() {
        if (this.dynamicComponent.instance && this.dynamicComponent.instance.editors) {
            return this.dynamicComponent.instance.editors.toArray().filter(_ => _.isUpdated).map(_ => _.model);
        }
        return [];
    }

    private getDynamicConfig() {
        var tpl: any[] = [];
        if (this.viewMode && this.viewMode === "panel")
        {
            if (this.options.pagerPos === 'header')
            {
                tpl.push(`<div class="panel panel-${this.panelMode}">
            <div class="panel-heading" style="position:relative">
                <h3 class="panel-title">${this.title} <b style="cursor:pointer" (click)="slideToggle()" class="pull-right fa fa-{{slideState==='down'?'minus':'plus'}}-circle"></b></h3>
                <div style="position:absolute;top:2px;left:${this.options.pagerLeftPos}px" [style.display]="viewList?.length?'block':'none'" class="juPager" [linkPages]="config.linkPages" [pageSize]="config.pageSize" [data]="data" (onInit)="pagerInit($event)" (pageChange)="onPageChange($event)"></div>
                </div>
            <div class="panel-body" style="overflow:auto">            
            `);
            } else
            {
                tpl.push(`<div class="panel panel-${this.panelMode}">
            <div class="panel-heading">
                <h3 class="panel-title">${this.title} <b class="pull-right fa fa-{{slideState==='down'?'minus':'plus'}}-circle"></b></h3>
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
        } else {
            tpl.push('<div class="alert alert-info">There is no column defination</div>')
        }
        if (this.options.crud) {
            //this.renderForm(tpl);
        }
        tpl.push(`<div class="filter-window" #filterWindow>
        <div class="title" (click)="hideFilterWindow()"><span>Title</span><a href="javascript:;" title="Close filter window." ><b class="fa fa-remove"></b></a></div>
        <div class="filter-content"></div>
        </div>`);
        if (this.viewMode && this.viewMode === "panel") {
            tpl.push('</div></div>');
        }
        return { tpl: tpl.join('') };
    }
    private renderTable(tpl: any[])
    {
        if (this.options.pagerPos === 'top')
        {
            tpl.push(`<div [style.display]="viewList?.length?'block':'none'" class="juPager" [linkPages]="config.linkPages" [pageSize]="config.pageSize" [data]="data" (onInit)="pagerInit($event)" (pageChange)="onPageChange($event)"></div>`);
        }
       
        tpl.push(`<table class="${this.options.classNames} tbl">`);
        tpl.push('<thead>');
        tpl.push(this.getHeader(this.options.columnDefs));
        tpl.push('</thead>');
        tpl.push(`<tbody (click)="hideFilterWindow()" style="height:${this.options.height}px">`);
        tpl.push(this.options.enableCellEditing ? this.getCellEditingView() : this.options.enableTreeView ? this.getTreeView() : this.getPlainView());
        tpl.push('</tbody>');
        tpl.push('</table>');

        if (this.options.pagerPos === 'bottom')
        {
            tpl.push(`<div [style.display]="viewList?.length?'block':'none'" class="juPager" [linkPages]="config.linkPages" [pageSize]="config.pageSize" [data]="data" (onInit)="pagerInit($event)" (pageChange)="onPageChange($event)"></div>`);
        }
    }
    private getCellEditingView() {
        let tpl: any[] = [];
        tpl.push(`<tr ${this.options.rowEvents} [ngClass]="config.trClass(row, i, f, l)" [model]="row" [config]="config" class="row-editor" *ngFor="let row of viewList;${this.options.trackBy ? 'trackBy:trackByResolver();' : ''}let i = index;let f=first;let l = last">`);
        this.options.columnDefs.forEach((item, index) => {
            this.getCell(item, `config.columnDefs[${index}]`, tpl, index);
        });
        tpl.push('</tr>');
        return tpl.join('');
    }
    private getDataExpression(item: any, config: string) {
        if (!item.dataSrc) {
            item.dataSrc = [];
        }
        if (Array.isArray(item.dataSrc)) {
            return `${config}.dataSrc`;
        }
        return `${config}.dataSrc() | async`
    }
    private getHeaderName(item) {

    }
    private getCell(item, config: string, tpl: any[], index: number) {
        var style = '', change = '', validation = '', header = '';
        if (item.type) {
            if (item.validators) {
                validation = ` <i [ngClass]="isValid('${item.field}', i)" class="validation fa fa-info-circle" [title]="getValidationMsg('${item.field}', i)"></i>`;
            }
            item.width = item.width || 120;           
            style = item.width ? `style="display:inline-block;" [style.width.px]="config.columnDefs[${index}].width-40"` : '';
            item.headerName = item.headerName || '';
            header = item.headerName.replace(/(<([^>]+)>)/ig, '');
            switch (item.type) {
                case 'juSelect':
                    change = item.change ? ` (option-change)="${config}.change($event)"` : '';
                    tpl.push(`<td [style.width.px]="config.columnDefs[${index}].width"><div ${style}>
                    <juSelect 
                        ${change} 
                        [config]="${config}" 
                        [disabled]="${config}.disabled"
                        [hide-search]="${item.search ? 'false' : 'true'}"
                        method="${item.method || 'getValues'}"
                        [model]="row"                        
                        property-name="${item.field}"
                        view-mode="${item.viewMode || 'select'}"
                        [data-src]="${this.getDataExpression(item, config)}"
                        [index]="i"
                    >
                    </juSelect></div>`);
                    tpl.push(validation);
                    tpl.push('</td>');
                    break;
                case 'select':
                    change = item.change ? `(change)="${config}.change(row, i)"` : '';
                    tpl.push(`<td [style.width.px]="config.columnDefs[${index}].width"><select ${style} ${change} class="select form-control" [(ngModel)]="row.${item.field}" >
                            <option value="">{{${config}.emptyOptionText||'Select option'}}</option>
                            <option *ngFor="let v of ${this.getDataExpression(item, config)}" [value]="v.value">{{v.name}}</option>
                        </select>`);
                    tpl.push(validation);
                    tpl.push('</td>');
                    break;
                case 'html':
                    tpl.push(`<td [style.width.px]="config.columnDefs[${index}].width">${item.content}</td>`);
                    break;
                case 'datepicker':
                    tpl.push(`<td [style.width.px]="config.columnDefs[${index}].width"><div ${style}>
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
                    tpl.push(`<td [style.width.px]="config.columnDefs[${index}].width"><div ${style}><input ${style} class="text form-control" type="${item.type}" [(ngModel)]="row.${item.field}" placeholder="Enter ${header}">`);
                    tpl.push('</div>');
                    tpl.push(validation);
                    tpl.push('</td>');
                    break;
                case 'textarea':
                    tpl.push(`<td [style.width.px]="config.columnDefs[${index}].width"><div ${style}><textarea ${style} class="text form-control" type="${item.type}" [(ngModel)]="row.${item.field}" placeholder="Enter ${header}"></textarea>`);
                    tpl.push('</div>');
                    tpl.push(validation);
                    tpl.push('</td>');
                    break;
                default:
                    tpl.push(this.getNormalTD(item, index));
                    break;
            }
        } else {
            tpl.push(this.getNormalTD(item, index));
        }
    }
    private getPlainView() {
        let tpl: any[] = [];
        tpl.push(`<tr ${this.options.rowEvents} [ngClass]="config.trClass(row, i, f, l)" *ngFor="let row of viewList;${this.options.trackBy ? 'trackBy:trackByResolver();' : ''}let i = index;let f=first;let l = last">`);
        this.options.columnDefs.forEach((item, index) => {
            tpl.push(this.getNormalTD(item, index));
        });
        tpl.push('</tr>');
        return tpl.join('');
    }
    private getNormalTD(item: any, index: number) {
        let tpl: any[] = [];
        tpl.push('<td ');
        if (item.width)
        {
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
        else if (item.field) {
            tpl.push(`>{{row.${item.field}}}`);
        } else {
            tpl.push(`>`);
        }
        tpl.push('</td>');
        return tpl.join('');
    }
    private getParams(row: string, level: number) {
        return level === 0 ? `${row}, i, f, l` : `${row}, i${level}, f${level}, l${level}`;
    }
    private getLevel(index: number, level: number) {
        return index === 0 ? `class="level-${level}"` : '';
    }
    private renderTr(row: string, level: number, previousChild: string = 'row') {
        let tpl: any[] = [];
        if (level > 0) {
            tpl.push(`<template [ngIf]="${previousChild}.expand">`);
            tpl.push(`<template ngFor let-${row} [ngForOf]="${previousChild}.items" let-i${level}="index" let-f${level}="first" let-l${level}="last" ${this.options.trackBy ? '[ngForTrackBy]="trackByResolver()"' : ''}>`);
        }
        tpl.push(`<tr ${this.options.rowEvents} [ngClass]="config.trClass(${this.getParams(row, level)})">`);
        this.options.columnDefs.forEach((item, index) => {
            tpl.push(`<td ${this.getLevel(index, level)}`);
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
                if (index === 0) {
                    tpl.push(`><a *ngIf="${row}.hasChild||${row}.items" href="javascript:;" (click)="toggleChildView(${row})" title="Toggling for child view."><b class="fa fa-{{${row}.expand?'minus':'plus'}}-square-o"></b></a>
                        {{${row}.${item.field}}}`);
                } else {
                    tpl.push(`>{{${row}.${item.field}}}`);
                }
            } else {
                tpl.push(`>`);
            }
            tpl.push('</td>');
        });
        tpl.push('</tr>');

        return tpl.join('');
    }
    private getTreeView() {
        let tpl: any[] = [];
        tpl.push(`<template ngFor let-row [ngForOf]="viewList" let-i="index" let-f="first" let-l="last" ${this.options.trackBy ? '[ngForTrackBy]="trackByResolver()"' : ''}>`);
        tpl.push(this.renderTr('row', 0));
        tpl.push(this.renderTr('child1', 1, 'row'));

        let temp: any[] = [];
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
    private renderForm(tpl: any[]) {
        tpl.push(`<juForm viewMode="popup" title="Sample Form" (onLoad)="onFormLoad($event)" [options]="config.formDefs"></juForm>`);
    }

    //calculate header
    private headerHtml: any[] = [];
    private getHeader(hederDef) {
        var colDef = [], rc = this.row_count(hederDef), i = 0;
        while (i < rc) {
            this.headerHtml[i] = [];
            i++;
        }
        hederDef.forEach(it => {
            this.traverseCell(it, rc, 0, colDef);
        });
        if (rc > 1) {
            this.options.columnDefs = colDef;
        }
        this.headerHtml[0].push('<th style="width:24px">&nbsp;</th>');       
        return this.headerHtml.map(_ => `<tr>${_.join('')}</tr>`).reduce((p, c) => p + c, '');
    }
    private _colIndex: number = 0;
    private traverseCell(cell, rs, headerRowFlag, colDef: any[])
    {
        console.log(cell);
        if (cell.children) {

            this.headerHtml[headerRowFlag].push('<th');
            if (cell.children.length > 1) {
                this.totalCS = 0;
                this.getColSpan(cell);
                this.headerHtml[headerRowFlag].push(` colspan="${this.totalCS}"`);
            }
            this.headerHtml[headerRowFlag].push(`>${cell.headerName}</th>`);
            headerRowFlag++
            let rc = rs, hf = headerRowFlag;
            for (var i = 0; i < cell.children.length; i++) {
                this.traverseCell(cell.children[i], --rs, headerRowFlag, colDef);
                rs = rc;
            }

        } else {
            colDef.push(cell);
            this.headerHtml[headerRowFlag].push('<th');
            if (rs > 1) {
                this.headerHtml[headerRowFlag].push(` valign="bottom" rowspan="${rs}"`);
            }
            if (cell.width) {
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
            } else {
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
            this._colIndex++;
        }
    }
    private row_count(hederDef) {
        var max = 0;
        for (var i = 0; i < hederDef.length; i++) {
            max = Math.max(max, this.cal_header_row(hederDef[i], 1));
        }
        return max;
    }
    private cal_header_row(cell, row_count) {
        var max = row_count;
        if (cell.children) {
            row_count++;
            for (var i = 0; i < cell.children.length; i++) {
                max = Math.max(max, this.cal_header_row(cell.children[i], row_count));
            }
        }
        return max;
    }
    private totalCS: number = 0;
    private getColSpan(cell: any) {
        if (cell.children) {
            cell.children.forEach(it => {
                this.totalCS++;
                this.getColSpanHelper(it);
            });
        }
    }
    private getColSpanHelper(cell: any) {
        if (cell.children) {
            this.totalCS--;
            cell.children.forEach(it => {
                this.totalCS++;
                this.getColSpan(it);
            });
        }
    }
    //end of calculte header
    setDropdownData(key: string, value: any[]) {
        this.dynamicComponent.instance.setDropdownData(key, value);
    }
    setJuSelectData(key: string, value: any[], index: number) {
        this.dynamicComponent.instance.setJuSelectData(key, value, index);
    }
    slideToggle() {
        this.dynamicComponent.instance.slideToggle();
    }
    search(val: any) {
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
        let res: any[] = [];
        let len = this.options.columnDefs.length;
        this.data.forEach((item) => {
            for (var index = 0; index < len; index++) {
                let item2 = this.options.columnDefs[index];
                if (item2.field && item[item2.field] && item[item2.field].toString().toLowerCase().indexOf(val) != -1) {
                    res.push(item); break;
                }
            }
        });
        this.dynamicComponent.instance.data = res;
    }
    onFormLoad(form: juForm) {
        this.dynamicComponent.instance.formObj = form;
        this.options.api.form = form;
        if (this.options.onFormLoad) {
            this.options.onFormLoad(form);
        }
        this.onLoad.emit(this);
    }
}

function getComponent(obj: any) {
    @Component({
        selector: 'dynamic-grid',
        template: obj.tpl, 
        //directives: [juPager, juForm, rowEditor, juSelect, Datetimepicker],      
        encapsulation: ViewEncapsulation.None,
        animations: [
            trigger('slide', [
                state('up', style({ opacity: 0, height: 0, padding: '0px' })),
                state('down', style({ opacity: 1, height: '*' })),
                transition('up => down', animate('300ms ease-in')),
                transition('down => up', animate('200ms ease-out'))
            ])
        ]
    })
    class TableComponent {
        data: any[] = [];
        config: any = {};
        formObj: juForm;
        viewList: any[] = [];
        _copyOfData: any;
        private pager: juPager;
        private slideState: string = 'down';
        constructor(private renderer: Renderer, private el: ElementRef) {

        }
        @ViewChildren(rowEditor) editors: QueryList<rowEditor>;
        @ViewChild('filterWindow') filterWindowRef: ElementRef;
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
        pagerInit(pager: juPager) {
            this.pager = pager;
            this.config.api.pager = pager;
            this.pager.sspFn = this.config.sspFn;
        }

        onFormLoad(form: juForm) {
            this.formObj = form;
            if (this.config.onFormLoad) {
                this.config.onFormLoad(form);
            }
        }
        setDropdownData(key: string, value: any[]) {
            let col = this.config.columnDefs.find(_ => _.field === key);
            col.dataSrc = value;
        }
        setJuSelectData(key: string, value: any[], index: number) {
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
            this.pager.calculatePagelinkes();
            this.notifyFilter();
        }
        updateItem(item) {

        }
        removeItem(item) {
            this.data.splice(this.data.indexOf(item), 1);
            this._copyOfData.splice(this.data.indexOf(item), 1);
            this.pager.calculatePagelinkes();
            this.notifyFilter();

        }
        showMessage(message: string, messageCss: string) {
            if (this.formObj) {
                this.formObj.showMessage(message, messageCss);
            }
        }
        sort(colDef: any) {
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
                (a: any, b: any) => reverse * colDef.comparator(a, b) :
                function (a: any, b: any) { return a = a[colDef.field], b = b[colDef.field], reverse * (<any>(a > b) - <any>(b > a)); };
            this.data = [...this.data.sort(sortFn)];
        }
        sortIcon(colDef: any) {
            let hidden = typeof colDef.reverse === 'undefined';            
            return { 'fa-sort': hidden, 'fa-caret-up': colDef.reverse === false, 'fa-caret-down': colDef.reverse === true };
        }
        filterIcon(colDef: any) {
            return { 'icon-hide': !(colDef.filterApi && colDef.filterApi.isFilterActive()), 'icon-show': colDef.filterApi && colDef.filterApi.isFilterActive() };
        }
        private filterWindow: any;
        private currentFilter: any;
        toggleChildView(row: any) {
            row.expand = !row.expand;
            if (!(row.items && row.items.length > 0) && this.config.lazyLoad) {
                this.config.lazyLoad(row).subscribe(next => {
                    row.items = next;
                });
            }
        }
        showFilter(colDef: any, event: MouseEvent) {
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
        buildFilter(colDef: any) {
            try {
                if (!colDef.filterApi) {
                    switch (colDef.filter) {
                        case 'text':
                            colDef.filterApi = new TextFilter();
                            break;
                        case 'number':
                            colDef.filterApi = new NumberFilter();
                            break;
                        case 'set':
                            colDef.filterApi = new SetFilter();
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
                        }).filter((value: any, index: number, self: any[]) => self.indexOf(value) === index);
                    colDef.filterApi.bindData(colDef.filterApi.data);
                    colDef.dataUpdted = false;
                }
            } catch (e) {
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
        valueGetter(colDef: any) {
            try {
                if (colDef.params.valueGetter) {
                    return colDef.params.valueGetter(colDef.row);
                }
                return colDef.row[colDef.field];
            } catch (e) {
                console.error(e.message);
            }
        }
        filterChangedCallback() {
            let activeFilters: any[] = this.config.columnDefs.filter(it => it.filterApi && it.filterApi.isFilterActive());
            if (this.config.sspFn) {
                let filter = activeFilters.map(_ => ({ field: _.field, searchCategory: _.filterApi.searchCategory, searchText: _.filterApi.searchText }));
                this.pager.filter(filter);
                return;
            }
            let temp: any[] = [];
            this._copyOfData.forEach(row => {
                let flag: any = true;
                activeFilters.forEach((col: any, index: number) => {
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
    }
    return TableComponent;
}
function async_call(fx: Function, time = 0) {
    let tid = setTimeout(() => {
        fx();
        clearTimeout(tid);
    }, time);
}