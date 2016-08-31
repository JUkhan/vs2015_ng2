import {Component, OnInit, ElementRef, Input, DynamicComponentLoader, ChangeDetectionStrategy,
    ViewContainerRef, Output, EventEmitter, OnDestroy, ComponentRef, ViewEncapsulation, Injector, OnChanges, ApplicationRef} from '@angular/core';
import {Validators}            from '@angular/common';
import {juSelect}              from './juSelect';
import {Datetimepicker}        from './Datetimepicker';
import {CkEditor, FileSelect}  from './CkEditor';
import {Observable, Subject}   from 'rxjs/Rx';
import * as _ from 'lodash';
declare var jQuery: any;

@Component({
    moduleId: module.id,
    selector: 'juForm,[juForm],.juForm',
    encapsulation: ViewEncapsulation.None,
    template: '<div></div>',
    styleUrls: ['./juForm.css'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class juForm implements OnInit, OnDestroy, OnChanges {
    
    @Input('viewMode')
    viewMode: string = 'panel';

    @Input('model')
    model: any;

    @Input('options')
    options: any = {};
    @Input('panelMode')
    panelMode: string = 'default';
    //outputs
    @Output('onModalClose')
    onModalClose = new EventEmitter();

    @Output('onLoad')
    onLoad = new EventEmitter();
    isUpdate: boolean = false;
    popupForm: any;    
    dynamicComponent: ComponentRef<any>;
    constructor(private _elementRef: ElementRef,
        private loader: DynamicComponentLoader,
        private viewContainerRef: ViewContainerRef) { }

    valueChanges(key: string): Observable<any> {
        if (key === 'form') {
            let _observers: any[] = [];
            for (var prop in this.options._events) {
                if (prop !== 'undefined') {
                    _observers.push(this.valueChanges(prop));
                }
            }
            return Observable.merge(..._observers).map(_ => this.getModel());
        }
        let item = this.options._events[key];
        if (item && item.field) {
            let div = this._elementRef.nativeElement.nextSibling.firstChild;
            switch (item.type) {

                case 'juSelect':
                    return item.field.api.valueChanges;
                case 'select':
                    return Observable.fromEvent(div.querySelector('.' + item.field.field.split('.').join('_')), 'change')
                        .map((_: any) => ({ value: _.target.value, sender: _.target, form: this }));
                default:
                    return Observable.fromEvent(div.querySelector('.' + item.field.field.split('.').join('_')), 'keyup')
                        .map((_: any) => _.target.value);
            }

        }
        return Observable.empty();
    }
    get valid() {
        for (var prop in this.options._events) {
            if (!this.options._events[prop].hideMsg) {
                return false;
            }
        }
        return true;
    }
    ngOnChanges(changes) {

    }
    ngOnInit() {        
        this.options.viewMode = this.viewMode;
        this.options._events = {};
        if (this.viewMode === 'popup') {
            this.options.onModalClose = this.onModalClose;

            jQuery(this._elementRef.nativeElement).find('.modal').on('hidden.bs.modal', (e: any) => {
                this.onModalClose.next(null);
            });
            if ('width' in this.options) {
                jQuery('.modal-dialog').css('width', this.options.width);
            }

        }
        for (var button in this.options.buttons) {
            if (!this.options.buttons[button].click) {
                this.options.buttons[button].click = () => { };
            }
        } 
        if (this.model) {
            this.options = _.cloneDeep(this.options);
            if (juForm.FORM_LIST.size > 0) {
                this._setCommonData(juForm.FORM_LIST.values().next().value, this.options);
            }
            juForm.FORM_LIST.set(this, this.options);
        }
        this.options.api = this;
        this.loadComponent();

    }
    static FORM_LIST: Map<juForm, any> = new Map<juForm, any>();
    getChildId() {
        return this.viewMode === 'popup' ? 'dc1' :
            this.viewMode === 'panel' ? 'dc2' : 'dc3';
    }
    loadComponent() {
        if (this.options.inputs || this.options.tabs) {
            // this.loader.loadAsRoot(getDynamicComponent(this._get_dynamic_config()), '#dcl', this.injector)
            this.loader.loadNextToLocation(getComponent(this.getConfig()), this.viewContainerRef)
                .then((com) => {
                    this.dynamicComponent = com;
                    com.instance.setConfig(this.options, this);
                    if (this.options.refreshBy) {
                        this.setModel(this.options.refreshBy);
                    }
                    if (this.isTab) {
                        let firstProp, index = 0;
                        for (var prop in this.activeTabs) {
                            com.instance.tabClick(prop, null, this.activeTabs[prop]);
                            if (index == 0) {
                                firstProp = prop;
                            }
                            index++;
                        }
                        com.instance.tabClick(firstProp, null, this.activeTabs[firstProp]);
                    } else {
                        com.instance.focus();
                    }
                    if (this.model) {
                        this.setModel(this.model);
                    }
                    async_call(() => { this.onLoad.emit(this); });

                    return com;
                });
        }
    }
    ngOnDestroy() {
        if (this.viewMode === 'popup') {
            //jQuery(this._elementRef.nativeElement).find('.modal').modal('destroy'); 
        }
        if (juForm.FORM_LIST.has(this)) {
            juForm.FORM_LIST.delete(this);
        }
        if (this.dynamicComponent) {
            this.dynamicComponent.destroy();
        }

    }
    showMessage(message: string, messageCss: string = 'alert alert-info') {
        if (this.dynamicComponent && this.dynamicComponent.instance) {
            this.dynamicComponent.instance.showMessage(message, messageCss)
        }
    }
    refresh(): juForm {
        this.setModel(this.options.refreshBy || {});
        this.isUpdate = false;
        return this;
    }
    showModal(isDisplayed: boolean = true) {
        jQuery(this._elementRef.nativeElement.nextSibling.firstChild).modal(isDisplayed ? 'show' : 'hide');
        if (isDisplayed) {
            this.dynamicComponent.instance.focus();
        }
        return this;
    }
    setModel(model: any): juForm {
        this.dynamicComponent.instance.setModel(model);
        return this
    }
    _setModelHelper(arr, fieldName, model) {
        let select = getItem(arr, (item: any) => item.field === fieldName && item.type === 'juSelect');
        if (select && select.api) {
            select.api.value = model[fieldName];
            return true;
        }
        select = getItem(arr, (item: any) => item.field === fieldName && item.type === 'datepicker');
        if (select && select.api) {
            select.api.setDate(model[fieldName]);
            return true;
        }
        return false;
    }
    getModel() {
        if (!(this.dynamicComponent && this.dynamicComponent.instance)) { return {}; }
        return this.dynamicComponent.instance.getModel();
    }
    setActiveTab(tabName: string): juForm {
        this.dynamicComponent.instance.tabClick(tabName);
        return this;
    }

    setData(key: string, data: any[]): juForm {
        let item = this.options._events[key];
        if (item && item.field) {
            item.field.data = data;
        }
        return this;
    }
    _setData(arr: any[], key: string, data: any): boolean {
        let item = getItem(arr, (x: any) => x.field === key && x.type === 'juSelect');
        if (item) {
            item.data = data;
            return true;
        }
        item = getItem(arr, (x: any) => x.field === key && x.type === 'select');
        if (item) {
            item.data = data;
            return true;
        }
        return false;
    }
    setDetilData(key: string, data: any[]) {
        juForm.FORM_LIST.forEach(options => {
            let item = options._events[key];
            if (item && item.field) {
                item.field.data = data;
            }
        });
        return this;
    }
    _setCommonData(preOpts, opts) {
        if (preOpts.inputs) {
            this._commonDataHelper(preOpts.inputs, opts.inputs);
        }
        else if (preOpts.tabs) {
            for (var tabName in preOpts.tabs) {
                this._commonDataHelper(preOpts.tabs[tabName], opts.tabs[tabName]);
            }
        }
    }
    _commonDataHelper(fields: Array<any>, desFields: Array<any>) {
        fields.forEach(item => {
            if (Array.isArray(item)) {
                item.forEach(item2 => {
                    if ((item2.type === 'juSelect' || item2.type === 'select') && item2.data) {
                        let resItem = getItem(desFields, (x: any) => x.field === item2.field && (x.type === 'juSelect' || x.type == 'select'));
                        if (resItem) {
                            resItem.data = item2.data;
                        }
                    }
                })
            } else {
                if ((item.type === 'juSelect' || item.type === 'select') && item.data) {
                    let resItem = getItem(desFields, (x: any) => x.field === item.field && (x.type === 'juSelect' || x.type == 'select'));
                    if (resItem) {
                        resItem.data = item.data;
                    }
                }
            }
        });
    }
    _setDetailData(options: any, key: string, data: any[]): juForm {

        if (options.inputs) {
            if (this._setData(options.inputs, key, data)) {
                return this;
            }
        }
        else if (options.tabs) {
            for (var tabName in options.tabs) {
                if (this._setData(options.tabs[tabName], key, data)) {
                    return this;
                }
            }
        }
        return this;
    }
    getSelectApi(key: string): juSelect {
        let item = this.options._events[key];
        if (item && item.field) {
            return item.field.api;
        }
        return null;
    }

    private isVertical: boolean = false;
    private isTab: boolean = false;
    private tabName: string = '';
    //private firstTab: string = '';
    private activeTabs: any = {};
    private tabid = 0;
   
    private getConfig() {
        var template: any[] = [], obj: any = {};        
        if (this.viewMode === 'panel') {
            template.push(`<div class="panel panel-${this.panelMode}">
            <div class="panel-heading" style="cursor:pointer" (click)="slideToggle()">
                <h3 class="panel-title">{{config.title}}</h3>
            </div>
            <div class="panel-body">
            <div *ngIf="message" [class]="messageCss">{{message}}</div>       
            `);
        } else if (this.viewMode === 'popup') {
            template.push(`<div class="modal fade" tabindex="-1" role="dialog">    
                <div class="modal-dialog">           
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title">{{config.title }}</h4>
                        </div>
                        <div class="modal-body">
                        <div *ngIf="message" [class]="messageCss">{{message}}</div>                    
                        `);
        }
        template.push('<div class="form-horizontal">');

        if (this.options.inputs) {
            template.push('<div class="non-tab-content">');
            this._setInputs(obj, template, this.options.inputs, 'config.inputs');
            template.push('</div>');
        }
        else if (this.options.tabs) {
            this.tabid++;
            this.isTab = true;
            template.push('<div class="card"><ul class="nav nav-tabs">');
            var index = 0;
            for (var prop in this.options.tabs) {
                if (index == 0) {
                    //this.firstTab = prop;                   
                    this.activeTabs[prop] = this.options.tabs[prop];
                }
                index++;
                template.push(`<li name="${prop}" [ngClass]="{disabled: !isTabEnable('${prop}', config.tabs['${prop}'])}"><a (click)="tabClick('${prop}', $event, config.tabs['${prop}'])" href="javascript: false" >${prop}</a></li>`);
            }
            template.push('</ul>');
            template.push('<div class="tabs">');
            for (var prop in this.options.tabs) {
                this.tabName = prop;
                template.push(`<div class="tab-content ${this.tabName.replace(/\s+/g, '')}" >`);
                this._setInputs(obj, template, this.options.tabs[prop], `config.tabs['${prop}']`);
                template.push('</div>');

            }
            template.push('</div></div>')
        }
        this._setButtons(obj, template);
        template.push('</div>');

        if (this.viewMode == 'panel') {
            template.push(`</div></div>`);
        } else if (this.viewMode == 'popup') {
            template.push(`</div></div></div></div>`);
        }
        return { tpl: template.join(''), groupConfig: obj };
    }    
    private _error_check = "1";
    private _setInputs(obj: any, template: any[], inputArr: any[], refPath: string, isRow = true) {
        inputArr.forEach((item: any, index: number) => {
            if (Array.isArray(item)) {
                template.push('<div class="form-group pbottom">');
                this._setInputs(obj, template, item, refPath + `[${index}]`, false);
                template.push('</div>');
            } else {
                this.isVertical = isRow;
                item.exp = item.exp || '';
                item.hideMsg = true;

                this.options._events[item.field] = { hideMsg: item.validators ? false : true, type: item.type || 'text', field: item };
                if (!(item.tabConfig && this.isTab)) {
                    if (item.field) {
                        var cfield = item.field.split('.').join('_');
                        obj[cfield] = this._getGroupConfig(item);
                        obj[cfield].hideMsg = true;
                    }
                    switch (item.type) {
                        case 'juSelect':
                            if (!item.change) {
                                item.change = (val: any) => { };
                            }
                            template.push(this._getjuSelectTemplate(item.field, item, refPath + `[${index}]`));
                            break;
                        case 'select':
                            if (!item.change) {
                                item.change = (val: any) => { };
                            }
                            template.push(this._getSelectTemplate(item.field, item, refPath + `[${index}]`));
                            break;
                        case 'html':
                            template.push(item.content || '');
                            break;
                        case 'ckeditor':
                            template.push(this._getCkEditorTemplate(item.field, item, refPath + `[${index}]`))
                            break;
                        case 'datepicker':
                            item.config = item.config || {}
                            if (!('autoclose' in item.config)) {
                                item.config.autoclose = true;
                            }
                            template.push(this._getDateTemplate(item.field, item, refPath + `[${index}]`));
                            break;
                        case 'detail':
                            template.push(this._getDetailTemplate(item.field, item, refPath + `[${index}]`));
                            break;
                        case 'file':
                            template.push(this._getFileTemplate(item.field, item, refPath + `[${index}]`));
                            break;
                        case 'groupLayout':
                            this.resolveGroupLayout(item, refPath, index, obj, template);
                            break;
                        default:
                            template.push(this._getInputTemplate(item.field, item, refPath + `[${index}]`));
                            break;
                    }
                }
            }
        });
    }
    private resolveGroupLayout(item: any, refPath: string,
        index: number, obj: any, template: any[], isNested = false) {
        if (item.items) {
            let groupTpl = [],
                gref = '',
                labelPos = this.options.labelPos,
                labelSize = this.options.labelSize;
            item.items.forEach((row: any, glIndex: number) => {
                gref = isNested ? refPath + `.items` + `[${glIndex}]` : refPath + `[${index}]` + `.items` + `[${glIndex}]`;
                groupTpl.push(`<div class="row">`);
                if (Array.isArray(row)) {
                    row.forEach((group: any, gindex: number) => {
                        this.resolveGroup(group, groupTpl, gref, gindex, index, labelPos, labelSize, obj);
                    });
                } else {
                    this.resolveGroup(row, groupTpl, gref, -1, index, labelPos, labelSize, obj);
                }
                groupTpl.push('</div>');

            });
            this.options.labelPos = labelPos;
            this.options.labelSize = labelSize;
            template.push(groupTpl.join(''));
        }
    }
    private resolveGroup(group: any, groupTpl: any[],
        gref: any, gindex: any, index: any, labelPos: any, labelSize: any, obj: any) {
        groupTpl.push(`<div class="col-md-${group.size || 12}" ${group.exp}>`);
        if (group.isContainer && group.items) {
            let nestedTpl = [];
            if (gindex >= 0) {
                this.resolveGroupLayout(group, gref + `[${gindex}]`, 0, obj, nestedTpl, true);
            } else {
                this.resolveGroupLayout(group, gref, 0, obj, nestedTpl, true);
            }
            groupTpl.push(nestedTpl.join(''));
        } else {
            if (!group.isContainer) {
                groupTpl.push(`<fieldset class="group-${'' + index + gindex}">`);
                groupTpl.push(`<legend>${group.groupName}</legend>`);
            }
            //group inputs and tabs 
            if (group.items) {
                let nestedTpl = [];
                if (gindex >= 0) {
                    this.resolveGroupLayout(group, gref + `[${gindex}]`, 0, obj, nestedTpl, true);
                } else {
                    this.resolveGroupLayout(group, gref, 0, obj, nestedTpl, true);
                }
                groupTpl.push(nestedTpl.join(''));
            } else {
                this.options.labelPos = group.labelPos || labelPos;
                this.options.labelSize = group.labelSize || labelSize;
                if (gindex >= 0) {
                    groupTpl.push(this.getGroupInputs(obj, gref + `[${gindex}]`, group));
                } else {
                    groupTpl.push(this.getGroupInputs(obj, gref, group));
                }
            }
            //end of group inputs and tabs
            if (!group.isContainer) {
                groupTpl.push('</fieldset>');
            }
        }
        groupTpl.push('</div>');
    }
    private getGroupInputs(obj: any, ref: string, group: any): string {

        let template: any[] = [];
        if (group.inputs) {
            template.push('<div class="non-tab-content">');
            this._setInputs(obj, template, group.inputs, ref + '.inputs');
            template.push('</div>');
        }
        else if (group.tabs) {
            this.isTab = true;
            template.push('<div class="card"><ul class="nav nav-tabs">');
            var index = 0;
            for (var prop in group.tabs) {
                if (index == 0) {
                    this.activeTabs[prop] = group.tabs[prop];
                    //this.firstTab = prop;
                }
                index++;//active: active==='${prop}',
                template.push(`<li name="${prop}" [ngClass]="{disabled: !isTabEnable('${prop}', ${ref}.tabs['${prop}'])}"><a (click)="tabClick('${prop}', $event, ${ref}.tabs['${prop}'])" href="javascript: false" >${prop}</a></li>`);
            }
            template.push('</ul>');
            template.push('<div class="tabs">');
            for (var prop in group.tabs) {
                this.tabName = prop;
                template.push(`<div class="tab-content ${this.tabName.replace(/\s+/g, '')}" >`);
                this._setInputs(obj, template, group.tabs[prop], `${ref}.tabs['${prop}']`);
                template.push('</div>');
            }
            template.push('</div></div>');
        }

        return template.join('');
    }
    private _setButtons(obj: any, template: any[]) {
        if (this.options.buttons) {
            template.push('<div class="modal-footer">');
            for (var prop in this.options.buttons) {
                switch (this.options.buttons[prop].type) {
                    case 'submit':
                        template.push(`<button type="submit" [disabled]="!isValid()" 
                        class="${this.options.buttons[prop].cssClass || 'btn btn-primary'}" (click)="config.buttons['${prop}'].click($event)" >${prop}</button>`);
                        break;
                    case 'close':
                        template.push(`<button type="button" data-dismiss="modal" 
                        class="${this.options.buttons[prop].cssClass || 'btn btn-default'}" (click)="config.buttons['${prop}'].click($event)" >${prop}</button>`);
                        break;
                    default:
                        template.push(`<button type="button" class="${this.options.buttons[prop].cssClass || 'btn btn-default'}" (click)="config.buttons['${prop}'].click($event)" >${prop}</button>`);
                        break;
                }

            }
            template.push('</div>');
        }
    }
    private _getGroupConfig(input: any) {
        var group: any[] = [''];
        //if (input.validators && input.validators.length >= 1) {
        // group.push(Validators.compose(input.validators));
        //}
        return group;
    }
    private _getDetailTemplate(fieldName: string, input: any, config: string) {
        let html = '';
        html += `
            <div class="form-detail">
                <button class="btn btn-success" title="Add a new item" (click)="AddNewItem(model.${fieldName}, '${fieldName}')"> <b class="fa fa-plus-circle"></b> New Item</button>
                ${input.detailInfo}`;
        if (input.search) {
            html += `<div class="pull-right search">             
                    <div class="input-group stylish-input-group">
                        <input class="form-control" placeholder="Search" (keyup)="detailSearch(${fieldName}search.value, '${fieldName}')" #${fieldName}search type="text">
                        <span class="input-group-addon">                        
                                <span class="fa fa-search"></span>                         
                        </span>
                    </div>            
                </div>`;
        }
        html += `</div>
            <div *ngFor="let item of model.${fieldName}">
                <juForm viewMode="form" *ngIf="!item.removed" [model]="item" [options]="${config}.options">
              
                </juForm>
            </div>
        `;
        return html;
    }
    private _getjuSelectTemplate(fieldName: string, input: any, config: string) {

        let labelSize = input.labelSize || this.options.labelSize || 3,
            labelPos = input.labelPos || this.options.labelPos || 'top',
            cfield = fieldName.split('.').join('_'),
            element = `<juSelect
                    [myForm]="myForm"
                    [config]="${config}"                     
                    #${cfield}select 
                    (option-change)="${config}.change($event)"                                
                    [disabled]="${config}.disabled"
                    [hide-search]="${input.search ? 'false' : 'true'}" 
                    method="${input.method || 'getValues'}" 
                    [model]="model"                     
                    property-name="${fieldName}" 
                    view-mode="${input.viewMode || 'select'}" 
                    [data-src]="${config}.data">
                </juSelect>                
                <div *ngIf="${cfield}select.hasError()" class="alert alert-danger" [innerHTML]="${config}.message"></div>`;
        return this.getHtml(input, element, fieldName, labelPos, labelSize);
    }
    private _getInputTemplate(fieldName: string, input: any, config: string) {

        let labelSize = input.labelSize || this.options.labelSize || 3,
            labelPos = input.labelPos || this.options.labelPos || 'top',
            cfield = fieldName.split('.').join('_');
        input.type = input.type || 'text';
         
        let element = (input.type === 'textarea') ?
            `<textarea (keyup)="vlidate_input(model.${fieldName}, ${config})" [disabled]="${config}.disabled" [(ngModel)]="model.${fieldName}" class="form-control ${cfield}" placeholder="Enter ${input.label || fieldName}"></textarea>`
            :
            `<input type="${input.type}" (keyup)="vlidate_input(model.${fieldName}, ${config})" [disabled]="${config}.disabled"   [(ngModel)]="model.${fieldName}" class="form-control ${cfield}" placeholder="Enter ${input.label || fieldName}">
            <div *ngIf="!${config}.hideMsg" class="alert alert-danger" [innerHTML]="${config}.message"></div>`;
        if(this.viewMode === 'table'){
             return `<td>${element}</td>`;
         }
        return this.getHtml(input, element, fieldName, labelPos, labelSize);

    }
    private getColOffset(input: any) {
        return input.offset ? ` col-md-offset-${input.offset}` : '';
    }
    private getRequiredInfo(field: any) {
        return field.validators ? '<span class="required" title="This field is required.">*</span>' : '';
    }
    private _getFileTemplate(fieldName: string, input: any, config: string) {
        let labelSize = input.labelSize || this.options.labelSize || 3,
            labelPos = input.labelPos || this.options.labelPos || 'top',
            cfield = fieldName.split('.').join('_'),
            element = `<input type="file" fileSelect [model]="model" propName="${fieldName}" [ext]="${config}.ext" ${input.multiple ? 'multiple' : ''} (click)="vlidate_input(model.${fieldName}, ${config})" [form]="myForm" [config]="${config}" [disabled]="${config}.disabled" class="form-control" placeholder="Select file(s)...">
                    <div *ngIf="!${config}.hideMsg" class="alert alert-danger" [innerHTML]="${config}.message"></div>`;
        return this.getHtml(input, element, fieldName, labelPos, labelSize);
    }
    private _getCkEditorTemplate(fieldName: string, input: any, config: string) {
        let labelSize = input.labelSize || this.options.labelSize || 3,
            labelPos = input.labelPos || this.options.labelPos || 'top',
            cfield = fieldName.split('.').join('_'),
            element =
                `<textarea ckeditor [config]="${config}" (click)="fieldClick('${fieldName}', ${config})" [disabled]="${config}.disabled" [(ngModel)]="model.${fieldName}" class="form-control" placeholder="Enter ${input.label || fieldName}"></textarea>
                 <div *ngIf="!${config}.hideMsg" class="alert alert-danger" [innerHTML]="${config}.message"></div>`;
        return this.getHtml(input, element, fieldName, labelPos, labelSize);

    }
    private _getDateTemplate(fieldName: string, input: any, config: string) {
        let labelSize = input.labelSize || this.options.labelSize || 3,
            labelPos = input.labelPos || this.options.labelPos || 'top',
            cfield = fieldName.split('.').join('_'),
            element = `<div (click)="vlidate_input(model.${fieldName}, ${config})" class="input-group date" [pickers]="${config}.config" picker-name="${input.type}" [model]="model" property="${fieldName}" [config]="${config}" [form]="myForm" >
                        <input type="text" [disabled]="${config}.disabled" [(ngModel)]="model.${fieldName}" class="form-control" placeholder="Enter ${input.label || fieldName}">
                        <span class="input-group-addon">
                            <span class="fa fa-calendar"></span>
                        </span>
                    </div>                    
                    <div *ngIf="!${config}.hideMsg" class="alert alert-danger" [innerHTML]="${config}.message"></div>`;
        return this.getHtml(input, element, fieldName, labelPos, labelSize);

    }
    private _getSelectTemplate(fieldName: string, input: any, config: string) {
        let labelSize = input.labelSize || this.options.labelSize || 3,
            labelPos = input.labelPos || this.options.labelPos || 'top',
            cfield = fieldName.split('.').join('_'),
            element = `<select (click)="vlidate_input(model.${fieldName}, ${config})" (change)="${config}.change({value:${cfield}.value, sender:${cfield}, form:myForm})" #${cfield} [disabled]="${config}.disabled" [(ngModel)]="model.${fieldName}" class="form-control ${cfield}">
                            <option value="">{{${config}.emptyOptionText||'Select option'}}</option>
                            <option *ngFor="let v of ${config}.data" [value]="v.value">{{v.name}}</option>
                        </select>
                        <div *ngIf="!${config}.hideMsg" class="alert alert-danger" [innerHTML]="${config}.message"></div>`;
        return this.getHtml(input, element, fieldName, labelPos, labelSize);

    }
    private getHtml(input: any, element: any, fieldName: string, labelPos: string, labelSize: any) {
        let label = (input.label || fieldName) + this.getRequiredInfo(input);
        if (this.isVertical) {
            return labelPos === 'top' ?
                `<div class="form-group" ${input.exp}>
                        <label>${label}</label>                        
                        ${element}                        
                </div>`:
                `<div class="form-group" ${input.exp}>
                            <label class="col-md-${labelSize} control-label">${label}</label>                        
                            <div class="col-md-${12 - labelSize}"> ${element}  </div>                      
                </div>`;
        }
        return labelPos === 'top' ?
            `<div class="col-md-${input.size}${this.getColOffset(input)}" ${input.exp}>
                        <label class="control-label">${label}</label>                                               
                        ${element}
            </div>`:
            `<div class="col-md-${input.size}${this.getColOffset(input)}" ${input.exp}>
                <div class="form-group">
                    <label class="col-md-${labelSize} control-label">${label}</label>                                               
                    <div class="col-md-${12 - labelSize}"> ${element}  </div>
                </div>       
            </div>`;

    }
}
function getComponent(obj: any) {
    //console.log(obj.tpl);
    @Component({
        selector: 'dynamic-form',
        template: obj.tpl
         //directives: [juSelect, Datetimepicker, CkEditor, juForm, FileSelect] 
    })
    class DynamicComponent {
        form: any; model: any = {}; config: any = {}; buttons: any; active: any = ''; tabName: string = '';
        myForm: any = {};
        constructor(private el: ElementRef) {
            //this.form = fb.group(obj.groupConfig);
        }
        ngOnInit() {
            if (this.config.viewMode === 'popup') {
                jQuery(this.el.nativeElement).find('.modal').on('hidden.bs.modal', (e: any) => {
                    this.config.onModalClose.next(null);
                });
                if ('width' in this.config) {
                    jQuery(this.el.nativeElement).find('.modal-dialog').css('width', this.config.width);
                }
            }
        }
        slideToggle() {
            jQuery(this.el.nativeElement).find('.panel-body').slideToggle();
        }
        setModel(model: any) {
            this.model = model;
            for (let prop in this.config._events) {
                let dmodel = model, arr = prop.split('.');
                let field = this.config._events[prop].field;
                arr.forEach(it => dmodel = dmodel[it]);
                if (field.type === 'select' && typeof dmodel === 'undefined') {
                    if (arr.length > 1) {
                        let obj = model, len = arr.length - 1;
                        for (var i = 0; i < len; i++) {
                            obj = obj[arr[i]];
                        }
                        obj[arr[i]] = dmodel || '';
                    } else {
                        model[prop] = dmodel || '';
                    }
                }
                else if (field.type === 'juSelect') {
                    if (typeof dmodel === 'undefined') {
                        async_call(() => { field.api.checkAll(false); });
                    } else {
                        async_call(() => { field.api.value = dmodel; });
                    }
                }
                else if (field.type === 'datepicker' && dmodel) {
                    async_call(() => { field.api.setDate(dmodel); });
                }
                else if (field.type === 'ckeditor' && dmodel) {
                    async_call(() => { field.api.setData(dmodel); });
                }
                this.vlidate_input(dmodel, field, true);
            }
        }
        getModel() {
            for (var prop in this._sh) {
                this.model[prop] = this._sh[prop];
            }
            for (let prop in this.config._events) {
                let item = this.config._events[prop].field;
                if (item.type === 'ckeditor') {
                    if (item.field.indexOf('.') !== -1) {
                        let arr = item.field.split('.'), len = arr.length - 1, obj = this.model;
                        for (var i = 0; i < len; i++) {
                            obj = obj[arr[i]];
                        }
                        obj[arr[i]] = item.api.getData();
                    } else {
                        this.model[item.field] = item.api.getData();
                    }
                }
            }
            return this.model;
        }
        valueChanges(key: string): Observable<string> {
            return this.form.controls[key].valueChanges;
        }
        syncModel(type: string = 'set') {

            if (this.config.inputs) {
                let item = getItem(this.config.inputs, (x: any) => x.type === 'ckeditor');
                if (item) {
                    if (type == 'get') {
                        this.model[item.field] = item.api.getData();
                    } else {
                        let tid = setTimeout(() => {
                            item.api.setData(this.model[item.field]);
                            clearTimeout(tid);
                        }, 0);
                    }
                }

            }
            else if (this.config.tabs) {
                for (var tabName in this.config.tabs) {
                    let item = getItem(this.config.tabs[tabName], (x: any) => x.type === 'ckeditor');
                    if (item) {
                        if (type == 'get') {
                            this.model[item.field] = item.api.getData();
                        } else {
                            let tid = setTimeout(() => {
                                item.api.setData(this.model[item.field]);
                                clearTimeout(tid);
                            }, 0);
                        }
                    }
                }

            }

        }
        isTabEnable(tabName: string, tab?: any) {

            if (tab) {
                let tabConfig = tab.find((tc: any) => tc.tabConfig);
                if (tabConfig) {
                    try {
                        return tabConfig.enable(this.form, this.model);
                    } catch (ex) {
                        return false;
                    }
                }
                return true;
            }
        }
        acriveTab: any;
        tabClick(tabName: string, e: any, tab?: any) {
            this.tabName = tabName;
            if (e) {
                e.preventDefault();
            }

            if (!this.isTabEnable(tabName, tab)) {
                return;
            }
            if (tab) {
                let tbn = tabName.replace(/\s+/g, ''),
                    parent = jQuery(this.el.nativeElement).find('div.' + tbn).parent('.tabs'),
                    tabs = parent.children();
                parent.prev().children().each((index, el) => {
                    let li = jQuery(el);
                    li.attr('name') === tabName ? li.addClass('active') : li.removeClass('active');
                });
                tabs.each((index, el) => {
                    let tabel = jQuery(el);
                    tabel.hasClass(tbn) ? tabel.show() : tabel.hide();
                });
            }
            this.active = tabName;
            this.acriveTab = tab;
            this.focus();
        }
        setConfig(options: any, mform: any) {
            this.config = options;
            this.myForm = mform;

        }
        isActive(tabName: string) {
            return this.active === tabName;
        }
        focus() {

            var inputs: any[] = [];
            if (this.active) {
                inputs = jQuery(this.el.nativeElement).find('div.' + this.active.replace(/\s+/g, '')).find('input');
            } else {
                inputs = jQuery(this.el.nativeElement).find('input');
            }
            if (inputs.length >= 1) {
                jQuery(inputs[0]).focus();
            }
        }
        fieldClick(fieldName: string, field: any) {
            if (field) {
                field.hideMsg = false;
            }
        }
        vlidate_input(val: any, field: any, internal = false) {
            field.hideMsg = true;
            if (field.validators) {
                if (Array.isArray(field.validators) && field.validators.length > 0) {
                    let len = field.validators.length, i = 0;
                    while (i < len && this.vlidate_input_helper(val, field, field.validators[i], internal)) {
                        i++;
                    }
                }
                else if (typeof field.validators === 'function') {
                    this.vlidate_input_helper(val, field, field.validators, internal);
                }
            }
        }
        vlidate_input_helper(val: any, field: any, fx: Function, internal) {
            let msg = fx(val, field.label || field.field);
            if (typeof msg === 'string') {
                field.message = msg;
                field.hideMsg = false;
            } else {
                field.hideMsg = msg;
            }
            this.config._events[field.field].hideMsg = field.hideMsg;
            if (internal) {
                field.hideMsg = true;
            }
            return field.hideMsg;
        }

        isValid() {

            for (var prop in this.config._events) {
                if (!this.config._events[prop].hideMsg) {
                    return false;
                }
            }

            return true;
        }
        hideValidationMessage(flag: boolean = true) {
            if (this.tabName) {
                this.__setValidationFlag(this.acriveTab, flag);
            } else {
                this.__setValidationFlag(this.config.inputs, flag);
            }

        }
        __setValidationFlag(arr: any[], flag: boolean) {
            if (arr) {
                arr.forEach((item: any) => {
                    if (Array.isArray(item)) {
                        this.__setValidationFlag(item, flag);
                    } else {
                        item.hideMsg = flag;
                    }

                });
            }
        }
        _sh: any = {};
        AddNewItem(list: Array<any>, fieldName: string) {
            list.unshift(this._getRefreshObject(fieldName));
            this._sh[fieldName] = list;
        }
        detailSearch(value, fieldName) {

            if (!this._sh[fieldName]) {
                this._sh[fieldName] = this.model[fieldName];
            }
            if (!value) {
                this.model[fieldName] = this._sh[fieldName];
            }
            let list: Array<any> = this._sh[fieldName];
            let filterPops = this._getFilterProps(fieldName);
            let res: Array<any> = [];
            value = value.toLowerCase();
            list.forEach(item => {
                for (var index = 0; index < filterPops.length; index++) {
                    if (item[filterPops[index]] && item[filterPops[index]].toString().toLowerCase().indexOf(value) != -1) {
                        res.push(item);
                        break;
                    }

                }
            });
            this.model[fieldName] = res;

        }
        _getRefreshObject(fieldName: string) {

            if (this.config.inputs) {
                let item = getItem(this.config.inputs, it => it.field === fieldName && it.type == 'detail');
                if (item && item.options.refreshBy) {
                    return Object.assign({}, item.options.refreshBy);
                }
            }
            else if (this.config.tabs) {
                for (var tabName in this.config.tabs) {
                    let item = getItem(this.config.tabs[tabName], it => it.field === fieldName && it.type == 'detail');
                    if (item && item.options.refreshBy) {
                        return Object.assign({}, item.options.refreshBy);
                    }
                }
            }
            return {};
        }
        _getFilterProps(fieldName: string): Array<string> {

            if (this.config.inputs) {
                let item = getItem(this.config.inputs, it => it.field === fieldName && it.type == 'detail');
                if (item && item.options.filter) {
                    return item.options.filter;
                }
            }
            else if (this.config.tabs) {
                for (var tabName in this.config.tabs) {
                    let item = getItem(this.config.tabs[tabName], it => it.field === fieldName && it.type == 'detail');
                    if (item && item.options.filter) {
                        return item.options.filter;
                    }
                }
            }
            return [];
        }
        message: string = '';
        messageCss: string = 'alert alert-info'
        showMessage(message: string, messageCss: string = 'alert alert-info') {
            this.message = message;
            this.messageCss = messageCss;
        }
    }
    return DynamicComponent;
}

function getItem(arr: any[], exp: Function) {
    for (var index = 0; index < arr.length; index++) {
        if (Array.isArray(arr[index])) {
            let temp = getItem(arr[index], exp);
            if (temp) {
                return temp;
            }
        }
        else if (arr[index].type === 'groupLayout') {
            let item = arr[index];
            if (item.items) {
                const temp = getGroupLayoutItem(item, exp);
                if (temp) {
                    return temp;
                }
            }
        }
        else if (exp(arr[index])) {
            return arr[index];
        }
    }
    return null;
}
function getGroupLayoutItem(item: any, exp: Function) {
    for (var ri = 0; ri < item.items.length; ri++) {
        // item.items.forEach((row: any, glIndex: number) => {
        if (Array.isArray(item.items[ri])) {
            for (var gi = 0; gi < item.items[ri].length; gi++) {
                const group = item.items[ri][gi];
                // row.forEach((group: any, gindex: number) => {
                if (group.inputs) {
                    const temp = getItem(group.inputs, exp);
                    if (temp) {
                        return temp;
                    }
                }
                else if (group.tabs) {
                    for (var tabName in group.tabs) {
                        const temp = getItem(group.tabs[tabName], exp);
                        if (temp) {
                            return temp;
                        }
                    }
                }
                else if (group.items) {
                    const temp = getGroupLayoutItem(group, exp);
                    if (temp) {
                        return temp;
                    }
                }
            }
        }
    }
    return null;
}
function async_call(fx: Function, time = 0) {
    let tid = setTimeout(() => {
        fx();
        clearTimeout(tid);
    }, time);
}