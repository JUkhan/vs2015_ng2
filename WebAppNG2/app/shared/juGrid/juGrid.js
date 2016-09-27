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
var juGrid_builder_1 = require('./juGrid.builder');
var juGrid = (function () {
    function juGrid(_elementRef, typeBuilder, viewContainerRef) {
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
    }
    juGrid.prototype.ngOnInit = function () {
        var _this = this;
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
            this.options.trClass = function () { return null; };
        }
        if (!('level' in this.options)) {
            this.options.level = 5;
        }
        if (this.options.formDefs) {
            this.options.formDefs.viewMode = 'popup';
        }
        this.options.rowEvents = this.options.rowEvents || '';
        if (this.options.crud) {
            this.options.newItem = function () {
                _this._oldItem = null;
                _this._updtedItem = null;
                _this.options.message = '';
                _this.componentRef.instance.formObj.isUpdate = false;
                _this.componentRef.instance.formObj.refresh();
                _this.componentRef.instance.formObj.showModal();
                if (_this.options.insert_CB) {
                    _this.options.insert_CB(_this.componentRef.instance.formObj);
                }
            };
            this.options.columnDefs.unshift({
                headerName: 'crud', width: 50, enable: this.options.create,
                action: [{
                        enable: this.options.update, title: 'Edit', icon: 'fa fa-pencil', click: function (data) {
                            _this._oldItem = data;
                            _this._updtedItem = Object.assign({}, data);
                            _this.options.message = '';
                            _this.componentRef.instance.formObj.isUpdate = true;
                            _this.componentRef.instance.formObj.setModel(_this._updtedItem);
                            _this.componentRef.instance.formObj.showModal();
                            if (_this.options.update_CB) {
                                _this.options.update_CB(_this.componentRef.instance.formObj, _this._updtedItem);
                            }
                        }
                    }, {
                        enable: this.options.remove, title: 'Remove', icon: 'fa fa-remove', click: function (data) {
                            if (confirm(_this.options.confirmMessage)) {
                                _this._oldItem = null;
                                _this._updtedItem = null;
                                if (_this.options.removeItem) {
                                    _this.options.removeItem(data);
                                }
                            }
                        }
                    }]
            });
        }
        this.options.api = { grid: this, form: null };
    };
    juGrid.prototype.ngOnChanges = function (changes) {
        if (this.data && this.wasViewInitialized) {
            this.componentRef.instance.setData(this.data);
        }
    };
    juGrid.prototype.ngAfterViewInit = function () {
        this.wasViewInitialized = true;
        this.refreshContent();
    };
    juGrid.prototype.ngOnDestroy = function () {
        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
    };
    juGrid.prototype.refreshContent = function () {
        var _this = this;
        if (this.componentRef) {
            this.componentRef.destroy();
        }
        this.typeBuilder
            .createComponentFactory(this.options)
            .then(function (factory) {
            _this.componentRef = _this
                .dynamicComponentTarget
                .createComponent(factory);
            var component = _this.componentRef.instance;
            component.config = _this.options;
            if (_this.options.data || _this.data) {
                component.setData(_this.data || _this.options.data);
            }
            if (!_this.options.crud) {
                async_call(function () { _this.onLoad.emit(_this); });
            }
        });
    };
    juGrid.prototype.getUpdatedRecords = function () {
        return this.componentRef.instance.editors.toArray().filter(function (_) { return _.isUpdated; }).map(function (_) { return _.model; });
    };
    juGrid.prototype.addItem = function (item) {
        if (this._searchInActive) {
            this.data.unshift(item);
        }
        this.componentRef.instance.addItem(item);
    };
    juGrid.prototype.getData = function () {
        return this.data.length ? this.data : this.componentRef.instance.viewList;
    };
    juGrid.prototype.showMessage = function (message, messageCss) {
        var _this = this;
        if (messageCss === void 0) { messageCss = 'alert alert-info'; }
        this.options.message = message;
        this.options.messageCss = messageCss;
        async_call(function () { _this.options.message = ''; }, 3000);
    };
    juGrid.prototype.updateItem = function (record) {
        if (this._oldItem && record) {
            for (var prop in record) {
                this._oldItem[prop] = record[prop];
            }
        }
    };
    juGrid.prototype.removeItem = function (item) {
        if (this._searchInActive) {
            this.data.splice(this.data.indexOf(item), 1);
        }
        this.componentRef.instance.removeItem(item);
    };
    juGrid.prototype.setSelectData = function (key, value) {
        this.componentRef.instance.setSelectData(key, value);
    };
    juGrid.prototype.setJuSelectData = function (key, value, index) {
        this.componentRef.instance.setJuSelectData(key, value, index);
    };
    juGrid.prototype.slideToggle = function () {
        this.componentRef.instance.slideToggle();
    };
    juGrid.prototype.search = function (val) {
        var _this = this;
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
        var res = [];
        var len = this.options.columnDefs.length;
        this.data.forEach(function (item) {
            for (var index = 0; index < len; index++) {
                var item2 = _this.options.columnDefs[index];
                if (item2.field && item[item2.field] && item[item2.field].toString().toLowerCase().indexOf(val) != -1) {
                    res.push(item);
                    break;
                }
            }
        });
        this.componentRef.instance.data = res;
    };
    juGrid.prototype.onFormLoad = function (form) {
        this.componentRef.instance.formObj = form;
        this.options.api.form = form;
        if (this.options.onFormLoad) {
            this.options.onFormLoad(form);
        }
        this.onLoad.emit(this);
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
            template: "<div class=\"grid-toolbar\">\n                    <div class=\"quickSearch\" *ngIf=\"options.quickSearch\">             \n                            <div class=\"input-group stylish-input-group\">\n                                <input type=\"text\" class=\"form-control\" (keyup)=\"search($event.target.value)\" placeholder=\"Search\">\n                                <span class=\"input-group-addon\">                        \n                                        <span class=\"fa fa-search\"></span>                         \n                                </span>\n                            </div>            \n                    </div>\n                  <div [style.left.px]=\"options.quickSearch?144:0\" class=\"tool-items\"><template [ngTemplateOutlet]=\"toolbar\"></template></div>\n\t            </div> \n                <div *ngIf=\"options.quickSearch||toolbar\" style=\"height:33px\">&nbsp;</div> \n                <div #dynamicContentPlaceHolder></div>  \n                <div class=\"juForm\" *ngIf=\"options.crud\" (onLoad)=\"onFormLoad($event)\" [options]=\"options.formDefs\"></div>"
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, juGrid_builder_1.juGridBuilder, core_1.ViewContainerRef])
    ], juGrid);
    return juGrid;
}());
exports.juGrid = juGrid;
function async_call(fx, time) {
    if (time === void 0) { time = 0; }
    var tid = setTimeout(function () { fx(); clearTimeout(tid); }, time);
}
//# sourceMappingURL=juGrid.js.map