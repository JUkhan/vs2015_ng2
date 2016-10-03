import { Component, ComponentRef, ViewChild, ViewContainerRef, Input, ElementRef, ChangeDetectionStrategy, Output, EventEmitter}   from '@angular/core';
import { AfterViewInit, OnInit, OnDestroy}          from '@angular/core';
import { OnChanges, SimpleChange, ComponentFactory} from '@angular/core';

import {juFormBuilder} from './juForm.builder';
import {juSelect, SelectOptions}              from './juSelect';
import {Datetimepicker}        from './Datetimepicker';
import {CkEditor, FileSelect}  from './CkEditor';
import {Observable, Subject}   from 'rxjs/Rx';
import * as _ from 'lodash';
declare var jQuery: any;

@Component({
    moduleId: module.id,    
    selector: 'juForm,[juForm],.juForm',
    template: `<div #dynamicContentPlaceHolder></div>`,
    changeDetection: ChangeDetectionStrategy.Default
})
export class juForm implements  AfterViewInit, OnChanges, OnDestroy, OnInit
{
    
    @ViewChild('dynamicContentPlaceHolder', { read: ViewContainerRef })
    protected dynamicComponentTarget: ViewContainerRef;    
    protected componentRef: ComponentRef<any>;

    @Input('options')           options: any = {};
    @Input('model')             model: any;
    @Output('onModalClose')     onModalClose = new EventEmitter();
    @Output('onLoad')           onLoad = new EventEmitter();
    isUpdate: boolean = false;
    popupForm: any;
    static FORM_LIST: Map<juForm, any> = new Map<juForm, any>();  
    protected wasViewInitialized = false;  
      
    constructor(protected typeBuilder: juFormBuilder, private _elementRef: ElementRef) { }

    public ngOnInit() {
        
    }

    public initOptions() {        
        this.options.viewMode = this.options.viewMode || 'panel';
        this.options.panelMode = this.options.panelMode || 'primary';
        this.options.title = this.options.title || 'Form title goes here';
        this.options._events = {};
        if (this.options.viewMode === 'popup') {
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
            this.options.viewMode = 'form';
            //if (juForm.FORM_LIST.size > 0) {           
            //    this.setCommonData(juForm.FORM_LIST.values().next().value, this.options);
            //}
            //juForm.FORM_LIST.set(this, this.options);
        }
        this.options.api = this;
    }
    ///set detail data///
    private setCommonData(preOpts, opts) { console.log(opts);
        for (var prop in preOpts._events) { 
                if (prop !== 'undefined' && preOpts._events[prop].type==='juSelect') {
                     opts._events[prop].field.data=  preOpts._events[prop].field.data;
                }
            }
        if (preOpts.inputs) {
            this.commonDataHelper(preOpts.inputs, opts.inputs);
        }
        else if (preOpts.tabs) {
            for (var tabName in preOpts.tabs) {
                this.commonDataHelper(preOpts.tabs[tabName], opts.tabs[tabName]);
            }
        }
    }
    private commonDataHelper(fields: Array<any>, desFields: Array<any>) {
        /*fields.forEach(item => {
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
        });*/
    }
    ///end of set detail data//
    public render() {
        this.refreshContent();
    }
    protected refreshContent() {       
        this.initOptions();
       
        if (this.componentRef) {           
            this.componentRef.destroy();
        }
        this.typeBuilder
            .createComponentFactory(this.options)
            .then((factory: ComponentFactory<any>) => {                
                this.componentRef = this
                    .dynamicComponentTarget
                    .createComponent(factory);               
                const component = this.componentRef.instance;               
               
                component.setConfig(this.options, this);
                if (this.options.refreshBy) {
                    this.setModel(this.options.refreshBy);
                }
                if (this.options.isTab) {
                    let firstProp, index = 0;
                    for (var prop in this.options.activeTabs) {
                        component.tabClick(prop, null, this.options.activeTabs[prop]);
                        if (index == 0) {
                            firstProp = prop;
                        }
                        index++;
                    }
                    component.tabClick(firstProp, null, this.options.activeTabs[firstProp]);
                } else {
                    component.focus();
                }
                
                if (this.model) {                    
                    this.setModel(this.model);
                }
                async_call(() => { this.onLoad.emit(this); });               
                
            });
    }    
    public ngAfterViewInit(): void {
        this.wasViewInitialized = true;
        this.refreshContent();
    }    
    public ngOnChanges(changes: { [key: string]: SimpleChange }): void {       
        if (this.wasViewInitialized) {
            return;
        }       
    }
    public ngOnDestroy() {
        if (this.componentRef)
        {            
            this.componentRef.destroy();
            this.componentRef = null;
        }
        if (juForm.FORM_LIST.has(this)) {
            juForm.FORM_LIST.delete(this);
        }
    }
    public getKeys()
    {
        return Object.keys(this.options._events).filter(_ => _ !== 'undefined');
    }
    public valueChanges(key: string): Observable<any> {
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
        if (item && item.field)
        {           
            const div = this._elementRef.nativeElement;
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
    public disabled(key: string, value: boolean):juForm {        
        this.options._events[key].field.disabled = value;
        if (this.options._events[key].type === "juSelect") {
            this.options._events[key].field.api.options.disabled = value;
        }
        return this;
    }
    public setLabel(key: string, value: string):juForm {        
        this.options._events[key].field.label = value;
        return this;        
    }
    public get valid(): boolean
    {
        return this.componentRef.instance.isValid();        
    }
    public showMessage(message: string, messageCss: string = 'alert alert-info'): juForm
    {       
        this.componentRef.instance.showMessage(message, messageCss);
        return this;
    }
    public refresh(): juForm {
        this.setModel(this.options.refreshBy || {});
        this.isUpdate = false;
        return this;
    }
    public showModal(isDisplayed: boolean = true): juForm
    {        
        jQuery(this._elementRef.nativeElement.firstChild.nextSibling.firstChild).modal(isDisplayed ? 'show' : 'hide');        
        if (isDisplayed) {
            this.componentRef.instance.focus();
        }
        return this;
    }
    public setModel(model: any): juForm {
        this.componentRef.instance.setModel(_.cloneDeep(model));        
        return this
    }
    public getModel() {        
        return this.componentRef.instance.getModel();
    }
    public setActiveTab(tabName: string): juForm {
        this.componentRef.instance.tabClick(tabName);
        return this;
    }
    public setData(key: string, data: any[]): juForm {
        let item = this.options._events[key]; 
        if (item && item.field) {
            item.field.data = data;
        }
        return this;
    }
    public setDetilData(key: string, data: any[]): juForm
    {
        juForm.FORM_LIST.forEach(options => {
            let item = options._events[key];
            if (item && item.field) {
                item.field.data = data;
            }
        });
        return this;
    }
    public getSelectApi(key: string): juSelect {
        let item = this.options._events[key];
        if (item && item.field) {
            return item.field.api;
        }
        return null;
    }
    public setSelectValue(key: string, value: any): juForm {
        const sapi = this.getSelectApi(key);
        if (sapi)
            sapi.setValue(value);
        return this;
    }
}
function async_call(fx: Function, time = 0) {
    let tid = setTimeout(() => {fx(); clearTimeout(tid);}, time);
}

export declare type TABS = { [key: string]: [FormElement | any] };


export interface FormElement
{
    field?: string;
    label?: string;
    type?: 'groupLayout' | 'html' | 'juSelect' | 'file' | string;
    change?: (event: {}) => void;
    validators?: Function | Array<Function>;
    viewMode?: 'select' | 'checkbox' | 'radio';
    sort?: boolean;
    data?: Array<any>;
    size?: number;
    offset?: number;
    labelPos?: 'left' | 'top';
    /**
    * This is groupLayout property
    * {type:'groupLayout', items:[
    *      {groupName:'Group-1' , inputs:[...]}
    * ]
    */
    groupName?: string;
    /**
     * This is groupLayout property
     * {type:'groupLayout', items:[
     *      {groupName:'Group-1' isContainer:true , tabs:[...]}
     * ]
     */
    isContainer?: boolean;
    /**
     * This is groupLayout property
     * {type:'groupLayout', items:[
     * {groupName:'Group-1' exp='[ngStyle]="config.disappear(model.country)"', tabs:{...}}
     * ]
     */
    exp?: string;
    /**
     * This is groupLayout property
     * {type:'groupLayout', items:[
     * {groupName:'Group-1'  items:[]|tabs|inputs}
     * ]
     */
    items?: [FormElement | any];
    /**
    * This is groupLayout property
    * {type:'groupLayout', items:[
    * {groupName:'Group-1', inputs:[]}
    * ]
    */
    inputs?: [FormElement | any];
    /**
    * This is groupLayout property
    * {type:'groupLayout', items:[
    * {groupName:'Group-1' tabs:{...}}
    * ]
    */
    tabs?: TABS;
    /**
     * tabConfig property is required if you use enable tab property
     *  {tabConfig: true, enable: (form, model) => { return !!model.firstName; }}
     */
    tabConfig?: boolean,
    /**
     * This enable callback property used for enable|disble tab on demand
     * {tabConfig: true, enable: (form, model) => { return !!model.firstName; }}
     */
    enable?: (form: any, model: any) => boolean;
    content?: string;
    options?: SelectOptions;
}

export interface FormOptions
{
    viewMode?:'form'|'panel'|'popup';
    panelMode?: 'default' |'primary'|'success'|'info'|'warning'|'danger';
    title?: string;
    labelPos?: 'left' | 'top';
    labelSize?: number;
    refreshBy?: {};
    inputs?: [FormElement | any];
    tabs?: TABS;
    buttons?: { [key: string]: { type: 'submit' | 'close' | 'button', cssClass?: string, click?: (event: any) => void } };
    api?: juForm;
    [key: string]: any;

}

