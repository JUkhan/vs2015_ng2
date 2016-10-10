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
const juGrid_builder_1 = require('./juGrid.builder');
const Rx_1 = require('rxjs/Rx');
let juGrid = class juGrid {
    constructor(_elementRef, typeBuilder, viewContainerRef) {
        this._elementRef = _elementRef;
        this.typeBuilder = typeBuilder;
        this.viewContainerRef = viewContainerRef;
        this.options = {};
        this._oldItem = null;
        this._updtedItem = null;
        this._searchInActive = false;
        this.data = [];
        this.onLoad = new core_1.EventEmitter();
        this.wasViewInitialized = false;
        this.shiftKey = false;
        this.ctrlKey = false;
        this.altKey = false;
    }
    ngOnInit() {
        if (!this.options) {
            return;
        }
        this.options.title = this.options.title || 'Title';
        this.options.panelMode = this.options.panelMode || 'primary';
        this.options.viewMode = this.options.viewMode || 'panel';
        this.options.pagerPos = this.options.pagerPos || 'top';
        this.options.pagerLeftPos = this.options.pagerLeftPos || 200;
        this.options.height = this.options.height || 500;
        this.options.rowHeight = this.options.rowHeight || 0;
        this.options.headerHeight = this.options.headerHeight || 0;
        this.options.linkPages = this.options.linkPages || 10;
        this.options.pageSize = this.options.pageSize || 10;
        this.options.confirmMessage = this.options.confirmMessage || 'Are you sure to remove this item?';
        if (!('enablePowerPage' in this.options)) {
            this.options.enablePowerPage = false;
        }
        if (!('enablePageSearch' in this.options)) {
            this.options.enablePageSearch = true;
        }
        if (!('colResize' in this.options)) {
            this.options.colResize = false;
        }
        if (!('crud' in this.options)) {
            this.options.crud = false;
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
            this.options.quickSearch = false;
        }
        if (!('trClass' in this.options)) {
            this.options.trClass = () => null;
        }
        if (!('level' in this.options)) {
            this.options.level = 5;
        }
        if (this.options.formDefs) {
            this.options.formDefs.viewMode = 'popup';
        }
        this.options.rowEvents = this.options.rowEvents || '';
        if (this.options.crud) {
            this.options.newItem = () => {
                this._oldItem = null;
                this._updtedItem = null;
                this.options.message = '';
                this.componentRef.instance.formObj.isUpdate = false;
                this.componentRef.instance.formObj.refresh();
                this.componentRef.instance.formObj.showModal();
                if (this.options.insert_CB) {
                    this.options.insert_CB(this.componentRef.instance.formObj);
                }
            };
            this.options.columnDefs.unshift({
                headerName: 'crud', width: 50, enable: this.options.create,
                action: [{
                        enable: this.options.update, title: 'Edit', icon: 'fa fa-pencil', click: (data) => {
                            this._oldItem = data;
                            this._updtedItem = Object.assign({}, data);
                            this.options.message = '';
                            this.componentRef.instance.formObj.isUpdate = true;
                            this.componentRef.instance.formObj.setModel(this._updtedItem);
                            this.componentRef.instance.formObj.showModal();
                            if (this.options.update_CB) {
                                this.options.update_CB(this.componentRef.instance.formObj, this._updtedItem);
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
        this.options.api = { grid: this, form: null };
        Rx_1.Observable.fromEvent(document, 'keyup').subscribe(e => {
            this.shiftKey = false;
            this.altKey = false;
            this.ctrlKey = false;
        });
    }
    ngOnChanges(changes) {
        if (this.data && this.wasViewInitialized) {
            this.componentRef.instance.setData(this.data);
        }
    }
    ngAfterViewInit() {
        this.wasViewInitialized = true;
        this.refreshContent();
    }
    ngOnDestroy() {
        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
    }
    keydown(key) {
        return Rx_1.Observable.fromEvent(document, 'keydown')
            .filter((e) => {
            this.shiftKey = e.shiftKey;
            this.ctrlKey = e.ctrlKey;
            this.altKey = e.altKey;
            switch (key) {
                case 'shift': return this.shiftKey;
                case 'ctrl': return this.ctrlKey;
                case 'alt': return this.altKey;
            }
            return false;
        });
    }
    render() {
        this.refreshContent();
    }
    refreshContent() {
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
            component.config = this.options;
            if (this.options.data || this.data) {
                component.setData(this.data || this.options.data);
            }
            if (!this.options.crud) {
                async_call(() => { this.onLoad.emit(this); });
            }
        });
    }
    getUpdatedRecords() {
        return this.componentRef.instance.editors.toArray().filter(_ => _.isUpdated).map(_ => _.model);
    }
    addItem(item) {
        if (this._searchInActive) {
            this.data.unshift(item);
        }
        this.componentRef.instance.addItem(item);
    }
    getData() {
        return this.data.length ? this.data : this.componentRef.instance.viewList;
    }
    showMessage(message, messageCss = 'alert alert-info') {
        this.options.message = message;
        this.options.messageCss = messageCss;
        async_call(() => { this.options.message = ''; }, 3000);
    }
    updateItem(record) {
        if (this._oldItem && record) {
            for (let prop in record) {
                this._oldItem[prop] = record[prop];
            }
        }
    }
    removeItem(item) {
        if (this._searchInActive) {
            this.data.splice(this.data.indexOf(item), 1);
        }
        this.componentRef.instance.removeItem(item);
    }
    setSelectData(key, value) {
        this.componentRef.instance.setSelectData(key, value);
    }
    setJuSelectData(key, value, index) {
        this.componentRef.instance.setJuSelectData(key, value, index);
    }
    slideToggle() {
        this.componentRef.instance.slideToggle();
    }
    search(val) {
        if (this.options.sspFn) {
            this.options.api.pager.search(val);
            return;
        }
        if (!val) {
            this._searchInActive = false;
            this.componentRef.instance.data = this.data;
            return;
        }
        this._searchInActive = true;
        val = val.toLowerCase();
        let res = [];
        let len = this.options.columnDefs.length;
        this.data.forEach((item) => {
            for (var index = 0; index < len; index++) {
                let item2 = this.options.columnDefs[index];
                if (item2.field && item[item2.field] && item[item2.field].toString().toLowerCase().indexOf(val) != -1) {
                    res.push(item);
                    break;
                }
            }
        });
        this.componentRef.instance.data = res;
    }
    onFormLoad(form) {
        this.componentRef.instance.formObj = form;
        this.options.api.form = form;
        if (this.options.onFormLoad) {
            this.options.onFormLoad(form);
        }
        this.onLoad.emit(this);
    }
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
    core_1.ViewChild('dynamicContentPlaceHolder', { read: core_1.ViewContainerRef }), 
    __metadata('design:type', core_1.ViewContainerRef)
], juGrid.prototype, "dynamicComponentTarget", void 0);
__decorate([
    core_1.ContentChild(core_1.TemplateRef), 
    __metadata('design:type', core_1.TemplateRef)
], juGrid.prototype, "toolbar", void 0);
juGrid = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: '.juGrid, [juGrid], juGrid',
        encapsulation: core_1.ViewEncapsulation.None,
        changeDetection: core_1.ChangeDetectionStrategy.Default,
        template: `<div class="grid-toolbar">
                    <div class="quickSearch" *ngIf="options.quickSearch">             
                            <div class="input-group stylish-input-group">
                                <input type="text" class="form-control" (keyup)="search($event.target.value)" placeholder="Search">
                                <span class="input-group-addon">                        
                                        <span class="fa fa-search"></span>                         
                                </span>
                            </div>            
                    </div>
                  <div [style.left.px]="options.quickSearch?144:0" class="tool-items"><template [ngTemplateOutlet]="toolbar"></template></div>
	            </div> 
                <div *ngIf="options.quickSearch||toolbar" style="height:33px">&nbsp;</div> 
                <div #dynamicContentPlaceHolder></div>  
                <div class="juForm" *ngIf="options.crud" (onLoad)="onFormLoad($event)" [options]="options.formDefs"></div>`
    }), 
    __metadata('design:paramtypes', [core_1.ElementRef, juGrid_builder_1.juGridBuilder, core_1.ViewContainerRef])
], juGrid);
exports.juGrid = juGrid;
function async_call(fx, time = 0) {
    let tid = setTimeout(() => { fx(); clearTimeout(tid); }, time);
}
