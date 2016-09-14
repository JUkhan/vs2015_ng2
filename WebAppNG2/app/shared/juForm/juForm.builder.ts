import {Component, ComponentFactory, NgModule, Input, Injectable, ElementRef} from '@angular/core';
import { CommonModule }  from "@angular/common";
import { FormsModule }   from "@angular/forms";
import {RuntimeCompiler} from '@angular/compiler';
import {SharedModule} from '../../../app/shared/shared.module';
import {juSelect} from '../../../app/shared/juForm/juSelect';
import {Observable, Subject}   from 'rxjs/Rx';
declare var jQuery: any;
export interface IDynamicForm {    
    showMessage(message: string, messageCss?: string);
    focus();
    setModel(model: any);
    getModel();
    tabClick(tabName: string, e?: any, tab?: any);
    setConfig(options: any, form: any);
}

@Injectable()
export class juFormBuilder {
    private options: any;
    private tabName: string;
    private tabid: number = 0;
    private isTab: boolean = false;
    private isVertical: boolean;
    private activeTabs: any = {};
    // wee need Dynamic component builder
    constructor(protected compiler: RuntimeCompiler) { }
    
    // this object is singleton - so we can use this as a cache
    //private _cacheOfFactories: { [templateKey: string]: ComponentFactory<IDynamicForm> } = {};
    private _cacheOfFactories: any = {};
    protected getTemplate() {
        var template: any[] = [], obj: any = {};
        if (this.options.viewMode === 'panel') {
            template.push(`<div class="panel panel-${this.options.panelMode}">
            <div class="panel-heading" style="cursor:pointer" (click)="slideToggle()">
                <h3 class="panel-title">{{config.title}} <b class="pull-right fa fa-{{slideState==='down'?'minus':'plus'}}-circle"></b></h3>
            </div>
            <div class="panel-body">
            <div [style.display]="message?'block':'none'" [class]="messageCss">{{message}}</div>       
            `);
        } else if (this.options.viewMode === 'popup') {
            template.push(`<div class="modal fade" tabindex="-1" role="dialog">    
                <div class="modal-dialog">           
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title">{{config.title }}</h4>
                        </div>
                        <div class="modal-body">
                        <div [style.display]="message?'block':'none'" [class]="messageCss">{{message}}</div>                    
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

        if (this.options.viewMode == 'panel') {
            template.push(`</div></div>`);
        } else if (this.options.viewMode == 'popup') {
            template.push(`</div></div></div></div>`);
        }
        return  template.join('');
    } 
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
                }
                index++;
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
        if (this.options.viewMode === 'table') {
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
    //end of template
    public createComponentFactory(options: any)
        : Promise<ComponentFactory<IDynamicForm>> {
        this.options = options;
        let tpl = this.getTemplate();
        options.isTab = this.isTab;
        options.activeTabs = this.activeTabs;
        let factory = this._cacheOfFactories[options];

        if (factory) {
            console.log("Module and Type are returned from cache")

            return new Promise((resolve) => {
                resolve(factory);
            });
        }

        // unknown template ... let's create a Type for it
        let type = this.createNewComponent(tpl);
        let module = this.createComponentModule(type);       

        return new Promise((resolve) => {
            this.compiler
                .compileModuleAndAllComponentsAsync(module)
                .then((moduleWithFactories) => {
                    factory = _.find(moduleWithFactories.componentFactories, { componentType: type });

                    this._cacheOfFactories[options] = factory;

                    resolve(factory);
                });
        });
    }

    protected createNewComponent(tmpl: string) {
        @Component({
            selector: 'dynamic-form',
            template: tmpl,
        })
        class DynamicFormComponent implements IDynamicForm {
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
            private slideState: string = 'down';
            slideToggle() {
                jQuery(this.el.nativeElement).find('.panel-body').slideToggle();
                this.slideState = this.slideState === 'down' ? 'up' : 'down';
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
            //syncModel(type: string = 'set') {
               
            //    if (this.config.inputs) {
            //        let item = getItem(this.config.inputs, (x: any) => x.type === 'ckeditor');
            //        if (item) {
            //            if (type == 'get') {
            //                this.model[item.field] = item.api.getData();
            //            } else {
            //                let tid = setTimeout(() => {
            //                    item.api.setData(this.model[item.field]);
            //                    clearTimeout(tid);
            //                }, 0);
            //            }
            //        }

            //    }
            //    else if (this.config.tabs) {
            //        for (var tabName in this.config.tabs) {
            //            let item = getItem(this.config.tabs[tabName], (x: any) => x.type === 'ckeditor');
            //            if (item) {
            //                if (type == 'get') {
            //                    this.model[item.field] = item.api.getData();
            //                } else {
            //                    let tid = setTimeout(() => {
            //                        item.api.setData(this.model[item.field]);
            //                        clearTimeout(tid);
            //                    }, 0);
            //                }
            //            }
            //        }

            //    }

            //}
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
                let item = this.config._events[fieldName].field;
                if (item && item.options.refreshBy) {
                    return Object.assign({}, item.options.refreshBy);
                }                
                return {};
            }
            _getFilterProps(fieldName: string): Array<string> {
                let item = this.config._events[fieldName].field;
                if (item && item.options.filter) {
                    return item.options.filter;
                }                
                return [];
            }
            message: string = '';
            messageCss: string = ''
            showMessage(message: string, messageCss: string = 'alert alert-info') {
                this.message = message;
                this.messageCss = messageCss;
            }

        };
        
        return DynamicFormComponent;
    }
    protected createComponentModule(componentType: any) {
        @NgModule({
            imports: [
                CommonModule, FormsModule
            ],
            declarations: [
                componentType, juSelect
            ],
        })
        class RuntimeComponentModuleForJuForm {
        }        
        return RuntimeComponentModuleForJuForm;
    }
}
function async_call(fx: Function, time = 0) {
    let tid = setTimeout(() => { fx(); clearTimeout(tid); }, time);
}



