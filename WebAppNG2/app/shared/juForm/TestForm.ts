import { Component, ComponentRef, ViewChild, ViewContainerRef, Input, ElementRef, ChangeDetectionStrategy, Output, EventEmitter}   from '@angular/core';
import { AfterViewInit, OnInit, OnDestroy}          from '@angular/core';
import { OnChanges, SimpleChange, ComponentFactory} from '@angular/core';

import {IJUForm, juFormBuilder} from './juForm.builder';
import {juSelect}              from './juSelect';
import {Datetimepicker}        from './Datetimepicker';
import {CkEditor, FileSelect}  from './CkEditor';
import {Observable, Subject}   from 'rxjs/Rx';
import * as _ from 'lodash';
declare var jQuery: any;

@Component({
    moduleId: module.id,    
    selector: 'df',
    template: `<div #dynamicContentPlaceHolder></div>`,
    changeDetection: ChangeDetectionStrategy.Default
})
export class TestForm implements AfterViewInit, OnChanges, OnDestroy, OnInit {
    
    @ViewChild('dynamicContentPlaceHolder', { read: ViewContainerRef })
    protected dynamicComponentTarget: ViewContainerRef;    
    protected componentRef: ComponentRef<IJUForm>;

    @Input('options')           options: any = {};
    @Input('model')             model: any;
    @Output('onModalClose')     onModalClose = new EventEmitter();
    @Output('onLoad')           onLoad = new EventEmitter();
    isUpdate: boolean = false;
    popupForm: any;
    static FORM_LIST: Map<TestForm, any> = new Map<TestForm, any>();  
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
            if (TestForm.FORM_LIST.size > 0) {
                //this._setCommonData(juForm.FORM_LIST.values().next().value, this.options);
            }
            TestForm.FORM_LIST.set(this, this.options);
        }
        this.options.api = this;
    }

    protected refreshContent() {       
        this.initOptions();
       
        if (this.componentRef) {           
            this.componentRef.destroy();
        }
        this.typeBuilder
            .createComponentFactory(this.options)
            .then((factory: ComponentFactory<IJUForm>) => {                
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
                ///
                
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
    public disabled(key: string, value: boolean) {
        this.options._events[key].field.disabled = value;
    }
    public get valid() {
        for (var prop in this.options._events) {
            if (!this.options._events[prop].hideMsg) {
                return false;
            }
        }
        return true;
    }
    public showMessage(message: string, messageCss: string = 'alert alert-info') {       
        this.componentRef.instance.showMessage(message, messageCss);
    }
    public refresh(): TestForm {
        this.setModel(this.options.refreshBy || {});
        this.isUpdate = false;
        return this;
    }
    public showModal(isDisplayed: boolean = true) {
        jQuery(this._elementRef.nativeElement.nextSibling.firstChild).modal(isDisplayed ? 'show' : 'hide');
        if (isDisplayed) {
            this.componentRef.instance.focus();
        }
        return this;
    }
    public setModel(model: any): TestForm {
        this.componentRef.instance.setModel(_.cloneDeep(model));
        return this
    }
    public getModel() {        
        return this.componentRef.instance.getModel();
    }
    public setActiveTab(tabName: string): TestForm {
        this.componentRef.instance.tabClick(tabName);
        return this;
    }
    public setData(key: string, data: any[]): TestForm {
        let item = this.options._events[key];
        if (item && item.field) {
            item.field.data = data;
        }
        return this;
    }
    public setDetilData(key: string, data: any[]) {
        TestForm.FORM_LIST.forEach(options => {
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
}
function async_call(fx: Function, time = 0) {
    let tid = setTimeout(() => {fx(); clearTimeout(tid);}, time);
}


