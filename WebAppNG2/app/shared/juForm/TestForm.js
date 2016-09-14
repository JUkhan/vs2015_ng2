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
var juForm_builder_1 = require('./juForm.builder');
var Rx_1 = require('rxjs/Rx');
var _ = require('lodash');
var TestForm = (function () {
    function TestForm(typeBuilder, _elementRef) {
        this.typeBuilder = typeBuilder;
        this._elementRef = _elementRef;
        this.options = {};
        this.onModalClose = new core_1.EventEmitter();
        this.onLoad = new core_1.EventEmitter();
        this.isUpdate = false;
        this.wasViewInitialized = false;
    }
    TestForm.prototype.ngOnInit = function () {
    };
    TestForm.prototype.initOptions = function () {
        var _this = this;
        this.options.viewMode = this.options.viewMode || 'panel';
        this.options.panelMode = this.options.panelMode || 'primary';
        this.options.title = this.options.title || 'Form title goes here';
        this.options._events = {};
        if (this.options.viewMode === 'popup') {
            this.options.onModalClose = this.onModalClose;
            jQuery(this._elementRef.nativeElement).find('.modal').on('hidden.bs.modal', function (e) {
                _this.onModalClose.next(null);
            });
            if ('width' in this.options) {
                jQuery('.modal-dialog').css('width', this.options.width);
            }
        }
        for (var button in this.options.buttons) {
            if (!this.options.buttons[button].click) {
                this.options.buttons[button].click = function () { };
            }
        }
        if (this.model) {
            this.options = _.cloneDeep(this.options);
            if (TestForm.FORM_LIST.size > 0) {
            }
            TestForm.FORM_LIST.set(this, this.options);
        }
        this.options.api = this;
    };
    TestForm.prototype.refreshContent = function () {
        var _this = this;
        console.log('refresh...');
        this.initOptions();
        if (this.componentRef) {
            console.log('desrtroy');
            this.componentRef.destroy();
        }
        this.typeBuilder
            .createComponentFactory(this.options)
            .then(function (factory) {
            _this.componentRef = _this
                .dynamicComponentTarget
                .createComponent(factory);
            var component = _this.componentRef.instance;
            console.log(_this.options);
            component.setConfig(_this.options, _this);
            if (_this.options.refreshBy) {
                _this.setModel(_this.options.refreshBy);
            }
            if (_this.options.isTab) {
                var firstProp = void 0, index = 0;
                for (var prop in _this.options.activeTabs) {
                    component.tabClick(prop, null, _this.options.activeTabs[prop]);
                    if (index == 0) {
                        firstProp = prop;
                    }
                    index++;
                }
                component.tabClick(firstProp, null, _this.options.activeTabs[firstProp]);
            }
            else {
                component.focus();
            }
            if (_this.model) {
                _this.setModel(_this.model);
            }
            async_call(function () { _this.onLoad.emit(_this); });
        });
    };
    TestForm.prototype.ngAfterViewInit = function () {
        this.wasViewInitialized = true;
        this.refreshContent();
    };
    TestForm.prototype.ngOnChanges = function (changes) {
        if (this.wasViewInitialized) {
            return;
        }
    };
    TestForm.prototype.ngOnDestroy = function () {
        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
    };
    TestForm.prototype.valueChanges = function (key) {
        var _this = this;
        if (key === 'form') {
            var _observers = [];
            for (var prop in this.options._events) {
                if (prop !== 'undefined') {
                    _observers.push(this.valueChanges(prop));
                }
            }
            return Rx_1.Observable.merge.apply(Rx_1.Observable, _observers).map(function (_) { return _this.getModel(); });
        }
        var item = this.options._events[key];
        if (item && item.field) {
            var div = this._elementRef.nativeElement.nextSibling.firstChild;
            switch (item.type) {
                case 'juSelect':
                    return item.field.api.valueChanges;
                case 'select':
                    return Rx_1.Observable.fromEvent(div.querySelector('.' + item.field.field.split('.').join('_')), 'change')
                        .map(function (_) { return ({ value: _.target.value, sender: _.target, form: _this }); });
                default:
                    return Rx_1.Observable.fromEvent(div.querySelector('.' + item.field.field.split('.').join('_')), 'keyup')
                        .map(function (_) { return _.target.value; });
            }
        }
        return Rx_1.Observable.empty();
    };
    TestForm.prototype.disabled = function (key, value) {
        this.options._events[key].field.disabled = value;
    };
    Object.defineProperty(TestForm.prototype, "valid", {
        get: function () {
            for (var prop in this.options._events) {
                if (!this.options._events[prop].hideMsg) {
                    return false;
                }
            }
            return true;
        },
        enumerable: true,
        configurable: true
    });
    TestForm.prototype.showMessage = function (message, messageCss) {
        if (messageCss === void 0) { messageCss = 'alert alert-info'; }
        this.componentRef.instance.showMessage(message, messageCss);
    };
    TestForm.prototype.refresh = function () {
        this.setModel(this.options.refreshBy || {});
        this.isUpdate = false;
        return this;
    };
    TestForm.prototype.showModal = function (isDisplayed) {
        if (isDisplayed === void 0) { isDisplayed = true; }
        jQuery(this._elementRef.nativeElement.nextSibling.firstChild).modal(isDisplayed ? 'show' : 'hide');
        if (isDisplayed) {
            this.componentRef.instance.focus();
        }
        return this;
    };
    TestForm.prototype.setModel = function (model) {
        this.componentRef.instance.setModel(_.cloneDeep(model));
        return this;
    };
    TestForm.prototype.getModel = function () {
        return this.componentRef.instance.getModel();
    };
    TestForm.prototype.setActiveTab = function (tabName) {
        this.componentRef.instance.tabClick(tabName);
        return this;
    };
    TestForm.prototype.setData = function (key, data) {
        var item = this.options._events[key];
        if (item && item.field) {
            item.field.data = data;
        }
        return this;
    };
    TestForm.prototype.setDetilData = function (key, data) {
        TestForm.FORM_LIST.forEach(function (options) {
            var item = options._events[key];
            if (item && item.field) {
                item.field.data = data;
            }
        });
        return this;
    };
    TestForm.prototype.getSelectApi = function (key) {
        var item = this.options._events[key];
        if (item && item.field) {
            return item.field.api;
        }
        return null;
    };
    TestForm.FORM_LIST = new Map();
    __decorate([
        core_1.ViewChild('dynamicContentPlaceHolder', { read: core_1.ViewContainerRef }), 
        __metadata('design:type', core_1.ViewContainerRef)
    ], TestForm.prototype, "dynamicComponentTarget", void 0);
    __decorate([
        core_1.Input('options'), 
        __metadata('design:type', Object)
    ], TestForm.prototype, "options", void 0);
    __decorate([
        core_1.Input('model'), 
        __metadata('design:type', Object)
    ], TestForm.prototype, "model", void 0);
    __decorate([
        core_1.Output('onModalClose'), 
        __metadata('design:type', Object)
    ], TestForm.prototype, "onModalClose", void 0);
    __decorate([
        core_1.Output('onLoad'), 
        __metadata('design:type', Object)
    ], TestForm.prototype, "onLoad", void 0);
    TestForm = __decorate([
        core_1.Component({
            moduleId: module.id,
            styleUrls: ['./juForm.css'],
            selector: 'df',
            template: "<div #dynamicContentPlaceHolder></div>",
            changeDetection: core_1.ChangeDetectionStrategy.Default
        }), 
        __metadata('design:paramtypes', [juForm_builder_1.juFormBuilder, core_1.ElementRef])
    ], TestForm);
    return TestForm;
}());
exports.TestForm = TestForm;
function async_call(fx, time) {
    if (time === void 0) { time = 0; }
    var tid = setTimeout(function () { fx(); clearTimeout(tid); }, time);
}
//# sourceMappingURL=TestForm.js.map