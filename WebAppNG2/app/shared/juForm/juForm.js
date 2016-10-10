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
const juForm_builder_1 = require('./juForm.builder');
const Rx_1 = require('rxjs/Rx');
const _ = require('lodash');
let juForm_1 = class juForm {
    constructor(typeBuilder, _elementRef) {
        this.typeBuilder = typeBuilder;
        this._elementRef = _elementRef;
        this.options = {};
        this.onModalClose = new core_1.EventEmitter();
        this.onLoad = new core_1.EventEmitter();
        this.isUpdate = false;
        this.wasViewInitialized = false;
    }
    ngOnInit() {
    }
    initOptions() {
        this.options.viewMode = this.options.viewMode || 'panel';
        this.options.panelMode = this.options.panelMode || 'primary';
        this.options.title = this.options.title || 'Form title goes here';
        this.options._events = {};
        if (this.options.viewMode === 'popup') {
            this.options.onModalClose = this.onModalClose;
            jQuery(this._elementRef.nativeElement).find('.modal').on('hidden.bs.modal', (e) => {
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
        }
        this.options.api = this;
    }
    setCommonData(preOpts, opts) {
        console.log(opts);
        for (var prop in preOpts._events) {
            if (prop !== 'undefined' && preOpts._events[prop].type === 'juSelect') {
                opts._events[prop].field.data = preOpts._events[prop].field.data;
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
    commonDataHelper(fields, desFields) {
    }
    render() {
        this.refreshContent();
    }
    refreshContent() {
        this.initOptions();
        if (this.componentRef) {
            this.componentRef.destroy();
        }
        this.typeBuilder
            .createComponentFactory(this.options)
            .then((factory) => {
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
            }
            else {
                component.focus();
            }
            if (this.model) {
                this.setModel(this.model);
            }
            async_call(() => { this.onLoad.emit(this); });
        });
    }
    ngAfterViewInit() {
        this.wasViewInitialized = true;
        this.refreshContent();
    }
    ngOnChanges(changes) {
        if (this.wasViewInitialized) {
            return;
        }
    }
    ngOnDestroy() {
        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
        if (juForm_1.FORM_LIST.has(this)) {
            juForm_1.FORM_LIST.delete(this);
        }
    }
    getKeys() {
        return Object.keys(this.options._events).filter(_ => _ !== 'undefined');
    }
    valueChanges(key) {
        if (key === 'form') {
            let _observers = [];
            for (var prop in this.options._events) {
                if (prop !== 'undefined') {
                    _observers.push(this.valueChanges(prop));
                }
            }
            return Rx_1.Observable.merge(..._observers).map(_ => this.getModel());
        }
        let item = this.options._events[key];
        if (item && item.field) {
            const div = this._elementRef.nativeElement;
            switch (item.type) {
                case 'juSelect':
                    return item.field.api.valueChanges;
                case 'select':
                    return Rx_1.Observable.fromEvent(div.querySelector('.' + item.field.field.split('.').join('_')), 'change')
                        .map((_) => ({ value: _.target.value, sender: _.target, form: this }));
                default:
                    return Rx_1.Observable.fromEvent(div.querySelector('.' + item.field.field.split('.').join('_')), 'keyup')
                        .map((_) => _.target.value);
            }
        }
        return Rx_1.Observable.empty();
    }
    disabled(key, value) {
        this.options._events[key].field.disabled = value;
        if (this.options._events[key].type === "juSelect") {
            this.options._events[key].field.api.options.disabled = value;
        }
        return this;
    }
    setLabel(key, value) {
        this.options._events[key].field.label = value;
        return this;
    }
    get valid() {
        return this.componentRef.instance.isValid();
    }
    showMessage(message, messageCss = 'alert alert-info') {
        this.componentRef.instance.showMessage(message, messageCss);
        return this;
    }
    refresh() {
        this.setModel(this.options.refreshBy || {});
        this.isUpdate = false;
        return this;
    }
    showModal(isDisplayed = true) {
        jQuery(this._elementRef.nativeElement.firstChild.nextSibling.firstChild).modal(isDisplayed ? 'show' : 'hide');
        if (isDisplayed) {
            this.componentRef.instance.focus();
        }
        return this;
    }
    setModel(model) {
        this.componentRef.instance.setModel(_.cloneDeep(model));
        return this;
    }
    getModel() {
        return this.componentRef.instance.getModel();
    }
    setActiveTab(tabName) {
        this.componentRef.instance.tabClick(tabName);
        return this;
    }
    setData(key, data) {
        let item = this.options._events[key];
        if (item && item.field) {
            item.field.data = data;
        }
        return this;
    }
    setDetilData(key, data) {
        juForm_1.FORM_LIST.forEach(options => {
            let item = options._events[key];
            if (item && item.field) {
                item.field.data = data;
            }
        });
        return this;
    }
    getSelectApi(key) {
        let item = this.options._events[key];
        if (item && item.field) {
            return item.field.api;
        }
        return null;
    }
    setSelectValue(key, value) {
        const sapi = this.getSelectApi(key);
        if (sapi)
            sapi.setValue(value);
        return this;
    }
};
let juForm = juForm_1;
juForm.FORM_LIST = new Map();
__decorate([
    core_1.ViewChild('dynamicContentPlaceHolder', { read: core_1.ViewContainerRef }), 
    __metadata('design:type', core_1.ViewContainerRef)
], juForm.prototype, "dynamicComponentTarget", void 0);
__decorate([
    core_1.Input('options'), 
    __metadata('design:type', Object)
], juForm.prototype, "options", void 0);
__decorate([
    core_1.Input('model'), 
    __metadata('design:type', Object)
], juForm.prototype, "model", void 0);
__decorate([
    core_1.Output('onModalClose'), 
    __metadata('design:type', Object)
], juForm.prototype, "onModalClose", void 0);
__decorate([
    core_1.Output('onLoad'), 
    __metadata('design:type', Object)
], juForm.prototype, "onLoad", void 0);
juForm = juForm_1 = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'juForm,[juForm],.juForm',
        template: `<div #dynamicContentPlaceHolder></div>`,
        changeDetection: core_1.ChangeDetectionStrategy.Default
    }), 
    __metadata('design:paramtypes', [juForm_builder_1.juFormBuilder, core_1.ElementRef])
], juForm);
exports.juForm = juForm;
function async_call(fx, time = 0) {
    let tid = setTimeout(() => { fx(); clearTimeout(tid); }, time);
}
