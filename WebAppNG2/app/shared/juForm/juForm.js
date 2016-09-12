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
var Rx_1 = require('rxjs/Rx');
var _ = require('lodash');
var juForm = (function () {
    function juForm(_elementRef, loader, viewContainerRef) {
        this._elementRef = _elementRef;
        this.loader = loader;
        this.viewContainerRef = viewContainerRef;
        this.viewMode = 'panel';
        this.options = {};
        this.panelMode = 'primary';
        this.onModalClose = new core_1.EventEmitter();
        this.onLoad = new core_1.EventEmitter();
        this.isUpdate = false;
        this.isVertical = false;
        this.isTab = false;
        this.tabName = '';
        this.activeTabs = {};
        this.tabid = 0;
        this._error_check = "1";
    }
    juForm.prototype.valueChanges = function (key) {
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
    juForm.prototype.disabled = function (key, value) {
        this.options._events[key].field.disabled = value;
    };
    Object.defineProperty(juForm.prototype, "valid", {
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
    juForm.prototype.ngOnChanges = function (changes) {
    };
    juForm.prototype.ngOnInit = function () {
        var _this = this;
        this.options.viewMode = this.viewMode;
        this.options._events = {};
        if (this.viewMode === 'popup') {
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
            if (juForm.FORM_LIST.size > 0) {
                this._setCommonData(juForm.FORM_LIST.values().next().value, this.options);
            }
            juForm.FORM_LIST.set(this, this.options);
        }
        this.options.api = this;
        this.loadComponent();
    };
    juForm.prototype.getChildId = function () {
        return this.viewMode === 'popup' ? 'dc1' :
            this.viewMode === 'panel' ? 'dc2' : 'dc3';
    };
    juForm.prototype.loadComponent = function () {
        var _this = this;
        if (this.options.inputs || this.options.tabs) {
            this.loader.loadNextToLocation(getComponent(this.getConfig()), this.viewContainerRef)
                .then(function (com) {
                _this.dynamicComponent = com;
                com.instance.setConfig(_this.options, _this);
                if (_this.options.refreshBy) {
                    _this.setModel(_this.options.refreshBy);
                }
                if (_this.isTab) {
                    var firstProp = void 0, index = 0;
                    for (var prop in _this.activeTabs) {
                        com.instance.tabClick(prop, null, _this.activeTabs[prop]);
                        if (index == 0) {
                            firstProp = prop;
                        }
                        index++;
                    }
                    com.instance.tabClick(firstProp, null, _this.activeTabs[firstProp]);
                }
                else {
                    com.instance.focus();
                }
                if (_this.model) {
                    _this.setModel(_this.model);
                }
                async_call(function () { _this.onLoad.emit(_this); });
                return com;
            });
        }
    };
    juForm.prototype.ngOnDestroy = function () {
        if (this.viewMode === 'popup') {
        }
        if (juForm.FORM_LIST.has(this)) {
            juForm.FORM_LIST.delete(this);
        }
        if (this.dynamicComponent) {
            this.dynamicComponent.destroy();
        }
    };
    juForm.prototype.showMessage = function (message, messageCss) {
        if (messageCss === void 0) { messageCss = 'alert alert-info'; }
        if (this.dynamicComponent && this.dynamicComponent.instance) {
            this.dynamicComponent.instance.showMessage(message, messageCss);
        }
    };
    juForm.prototype.refresh = function () {
        this.setModel(this.options.refreshBy || {});
        this.isUpdate = false;
        return this;
    };
    juForm.prototype.showModal = function (isDisplayed) {
        if (isDisplayed === void 0) { isDisplayed = true; }
        jQuery(this._elementRef.nativeElement.nextSibling.firstChild).modal(isDisplayed ? 'show' : 'hide');
        if (isDisplayed) {
            this.dynamicComponent.instance.focus();
        }
        return this;
    };
    juForm.prototype.setModel = function (model) {
        this.dynamicComponent.instance.setModel(_.cloneDeep(model));
        return this;
    };
    juForm.prototype._setModelHelper = function (arr, fieldName, model) {
        var select = getItem(arr, function (item) { return item.field === fieldName && item.type === 'juSelect'; });
        if (select && select.api) {
            select.api.value = model[fieldName];
            return true;
        }
        select = getItem(arr, function (item) { return item.field === fieldName && item.type === 'datepicker'; });
        if (select && select.api) {
            select.api.setDate(model[fieldName]);
            return true;
        }
        return false;
    };
    juForm.prototype.getModel = function () {
        if (!(this.dynamicComponent && this.dynamicComponent.instance)) {
            return {};
        }
        return this.dynamicComponent.instance.getModel();
    };
    juForm.prototype.setActiveTab = function (tabName) {
        this.dynamicComponent.instance.tabClick(tabName);
        return this;
    };
    juForm.prototype.setData = function (key, data) {
        var item = this.options._events[key];
        if (item && item.field) {
            item.field.data = data;
        }
        return this;
    };
    juForm.prototype._setData = function (arr, key, data) {
        var item = getItem(arr, function (x) { return x.field === key && x.type === 'juSelect'; });
        if (item) {
            item.data = data;
            return true;
        }
        item = getItem(arr, function (x) { return x.field === key && x.type === 'select'; });
        if (item) {
            item.data = data;
            return true;
        }
        return false;
    };
    juForm.prototype.setDetilData = function (key, data) {
        juForm.FORM_LIST.forEach(function (options) {
            var item = options._events[key];
            if (item && item.field) {
                item.field.data = data;
            }
        });
        return this;
    };
    juForm.prototype._setCommonData = function (preOpts, opts) {
        if (preOpts.inputs) {
            this._commonDataHelper(preOpts.inputs, opts.inputs);
        }
        else if (preOpts.tabs) {
            for (var tabName in preOpts.tabs) {
                this._commonDataHelper(preOpts.tabs[tabName], opts.tabs[tabName]);
            }
        }
    };
    juForm.prototype._commonDataHelper = function (fields, desFields) {
        fields.forEach(function (item) {
            if (Array.isArray(item)) {
                item.forEach(function (item2) {
                    if ((item2.type === 'juSelect' || item2.type === 'select') && item2.data) {
                        var resItem = getItem(desFields, function (x) { return x.field === item2.field && (x.type === 'juSelect' || x.type == 'select'); });
                        if (resItem) {
                            resItem.data = item2.data;
                        }
                    }
                });
            }
            else {
                if ((item.type === 'juSelect' || item.type === 'select') && item.data) {
                    var resItem = getItem(desFields, function (x) { return x.field === item.field && (x.type === 'juSelect' || x.type == 'select'); });
                    if (resItem) {
                        resItem.data = item.data;
                    }
                }
            }
        });
    };
    juForm.prototype._setDetailData = function (options, key, data) {
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
    };
    juForm.prototype.getSelectApi = function (key) {
        var item = this.options._events[key];
        if (item && item.field) {
            return item.field.api;
        }
        return null;
    };
    juForm.prototype.getConfig = function () {
        var template = [], obj = {};
        if (this.viewMode === 'panel') {
            template.push("<div class=\"panel panel-" + this.panelMode + "\">\n            <div class=\"panel-heading\" style=\"cursor:pointer\" (click)=\"slideToggle()\">\n                <h3 class=\"panel-title\">{{config.title}} <b class=\"pull-right fa fa-{{slideState==='down'?'minus':'plus'}}-circle\"></b></h3>\n            </div>\n            <div class=\"panel-body\">\n            <div [style.display]=\"message?'block':'none'\" [class]=\"messageCss\">{{message}}</div>       \n            ");
        }
        else if (this.viewMode === 'popup') {
            template.push("<div class=\"modal fade\" tabindex=\"-1\" role=\"dialog\">    \n                <div class=\"modal-dialog\">           \n                    <div class=\"modal-content\">\n                        <div class=\"modal-header\">\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n                            <h4 class=\"modal-title\">{{config.title }}</h4>\n                        </div>\n                        <div class=\"modal-body\">\n                        <div [style.display]=\"message?'block':'none'\" [class]=\"messageCss\">{{message}}</div>                    \n                        ");
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
                template.push("<li name=\"" + prop + "\" [ngClass]=\"{disabled: !isTabEnable('" + prop + "', config.tabs['" + prop + "'])}\"><a (click)=\"tabClick('" + prop + "', $event, config.tabs['" + prop + "'])\" href=\"javascript: false\" >" + prop + "</a></li>");
            }
            template.push('</ul>');
            template.push('<div class="tabs">');
            for (var prop in this.options.tabs) {
                this.tabName = prop;
                template.push("<div class=\"tab-content " + this.tabName.replace(/\s+/g, '') + "\" >");
                this._setInputs(obj, template, this.options.tabs[prop], "config.tabs['" + prop + "']");
                template.push('</div>');
            }
            template.push('</div></div>');
        }
        this._setButtons(obj, template);
        template.push('</div>');
        if (this.viewMode == 'panel') {
            template.push("</div></div>");
        }
        else if (this.viewMode == 'popup') {
            template.push("</div></div></div></div>");
        }
        return { tpl: template.join(''), groupConfig: obj };
    };
    juForm.prototype._setInputs = function (obj, template, inputArr, refPath, isRow) {
        var _this = this;
        if (isRow === void 0) { isRow = true; }
        inputArr.forEach(function (item, index) {
            if (Array.isArray(item)) {
                template.push('<div class="form-group pbottom">');
                _this._setInputs(obj, template, item, refPath + ("[" + index + "]"), false);
                template.push('</div>');
            }
            else {
                _this.isVertical = isRow;
                item.exp = item.exp || '';
                item.hideMsg = true;
                _this.options._events[item.field] = { hideMsg: item.validators ? false : true, type: item.type || 'text', field: item };
                if (!(item.tabConfig && _this.isTab)) {
                    if (item.field) {
                        var cfield = item.field.split('.').join('_');
                        obj[cfield] = _this._getGroupConfig(item);
                        obj[cfield].hideMsg = true;
                    }
                    switch (item.type) {
                        case 'juSelect':
                            if (!item.change) {
                                item.change = function (val) { };
                            }
                            template.push(_this._getjuSelectTemplate(item.field, item, refPath + ("[" + index + "]")));
                            break;
                        case 'select':
                            if (!item.change) {
                                item.change = function (val) { };
                            }
                            template.push(_this._getSelectTemplate(item.field, item, refPath + ("[" + index + "]")));
                            break;
                        case 'html':
                            template.push(item.content || '');
                            break;
                        case 'ckeditor':
                            template.push(_this._getCkEditorTemplate(item.field, item, refPath + ("[" + index + "]")));
                            break;
                        case 'datepicker':
                            item.config = item.config || {};
                            if (!('autoclose' in item.config)) {
                                item.config.autoclose = true;
                            }
                            template.push(_this._getDateTemplate(item.field, item, refPath + ("[" + index + "]")));
                            break;
                        case 'detail':
                            template.push(_this._getDetailTemplate(item.field, item, refPath + ("[" + index + "]")));
                            break;
                        case 'file':
                            template.push(_this._getFileTemplate(item.field, item, refPath + ("[" + index + "]")));
                            break;
                        case 'groupLayout':
                            _this.resolveGroupLayout(item, refPath, index, obj, template);
                            break;
                        default:
                            template.push(_this._getInputTemplate(item.field, item, refPath + ("[" + index + "]")));
                            break;
                    }
                }
            }
        });
    };
    juForm.prototype.resolveGroupLayout = function (item, refPath, index, obj, template, isNested) {
        var _this = this;
        if (isNested === void 0) { isNested = false; }
        if (item.items) {
            var groupTpl_1 = [], gref_1 = '', labelPos_1 = this.options.labelPos, labelSize_1 = this.options.labelSize;
            item.items.forEach(function (row, glIndex) {
                gref_1 = isNested ? refPath + ".items" + ("[" + glIndex + "]") : refPath + ("[" + index + "]") + ".items" + ("[" + glIndex + "]");
                groupTpl_1.push("<div class=\"row\">");
                if (Array.isArray(row)) {
                    row.forEach(function (group, gindex) {
                        _this.resolveGroup(group, groupTpl_1, gref_1, gindex, index, labelPos_1, labelSize_1, obj);
                    });
                }
                else {
                    _this.resolveGroup(row, groupTpl_1, gref_1, -1, index, labelPos_1, labelSize_1, obj);
                }
                groupTpl_1.push('</div>');
            });
            this.options.labelPos = labelPos_1;
            this.options.labelSize = labelSize_1;
            template.push(groupTpl_1.join(''));
        }
    };
    juForm.prototype.resolveGroup = function (group, groupTpl, gref, gindex, index, labelPos, labelSize, obj) {
        groupTpl.push("<div class=\"col-md-" + (group.size || 12) + "\" " + group.exp + ">");
        if (group.isContainer && group.items) {
            var nestedTpl = [];
            if (gindex >= 0) {
                this.resolveGroupLayout(group, gref + ("[" + gindex + "]"), 0, obj, nestedTpl, true);
            }
            else {
                this.resolveGroupLayout(group, gref, 0, obj, nestedTpl, true);
            }
            groupTpl.push(nestedTpl.join(''));
        }
        else {
            if (!group.isContainer) {
                groupTpl.push("<fieldset class=\"group-" + ('' + index + gindex) + "\">");
                groupTpl.push("<legend>" + group.groupName + "</legend>");
            }
            if (group.items) {
                var nestedTpl = [];
                if (gindex >= 0) {
                    this.resolveGroupLayout(group, gref + ("[" + gindex + "]"), 0, obj, nestedTpl, true);
                }
                else {
                    this.resolveGroupLayout(group, gref, 0, obj, nestedTpl, true);
                }
                groupTpl.push(nestedTpl.join(''));
            }
            else {
                this.options.labelPos = group.labelPos || labelPos;
                this.options.labelSize = group.labelSize || labelSize;
                if (gindex >= 0) {
                    groupTpl.push(this.getGroupInputs(obj, gref + ("[" + gindex + "]"), group));
                }
                else {
                    groupTpl.push(this.getGroupInputs(obj, gref, group));
                }
            }
            if (!group.isContainer) {
                groupTpl.push('</fieldset>');
            }
        }
        groupTpl.push('</div>');
    };
    juForm.prototype.getGroupInputs = function (obj, ref, group) {
        var template = [];
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
                template.push("<li name=\"" + prop + "\" [ngClass]=\"{disabled: !isTabEnable('" + prop + "', " + ref + ".tabs['" + prop + "'])}\"><a (click)=\"tabClick('" + prop + "', $event, " + ref + ".tabs['" + prop + "'])\" href=\"javascript: false\" >" + prop + "</a></li>");
            }
            template.push('</ul>');
            template.push('<div class="tabs">');
            for (var prop in group.tabs) {
                this.tabName = prop;
                template.push("<div class=\"tab-content " + this.tabName.replace(/\s+/g, '') + "\" >");
                this._setInputs(obj, template, group.tabs[prop], ref + ".tabs['" + prop + "']");
                template.push('</div>');
            }
            template.push('</div></div>');
        }
        return template.join('');
    };
    juForm.prototype._setButtons = function (obj, template) {
        if (this.options.buttons) {
            template.push('<div class="modal-footer">');
            for (var prop in this.options.buttons) {
                switch (this.options.buttons[prop].type) {
                    case 'submit':
                        template.push("<button type=\"submit\" [disabled]=\"!isValid()\" \n                        class=\"" + (this.options.buttons[prop].cssClass || 'btn btn-primary') + "\" (click)=\"config.buttons['" + prop + "'].click($event)\" >" + prop + "</button>");
                        break;
                    case 'close':
                        template.push("<button type=\"button\" data-dismiss=\"modal\" \n                        class=\"" + (this.options.buttons[prop].cssClass || 'btn btn-default') + "\" (click)=\"config.buttons['" + prop + "'].click($event)\" >" + prop + "</button>");
                        break;
                    default:
                        template.push("<button type=\"button\" class=\"" + (this.options.buttons[prop].cssClass || 'btn btn-default') + "\" (click)=\"config.buttons['" + prop + "'].click($event)\" >" + prop + "</button>");
                        break;
                }
            }
            template.push('</div>');
        }
    };
    juForm.prototype._getGroupConfig = function (input) {
        var group = [''];
        return group;
    };
    juForm.prototype._getDetailTemplate = function (fieldName, input, config) {
        var html = '';
        html += "\n            <div class=\"form-detail\">\n                <button class=\"btn btn-success\" title=\"Add a new item\" (click)=\"AddNewItem(model." + fieldName + ", '" + fieldName + "')\"> <b class=\"fa fa-plus-circle\"></b> New Item</button>\n                " + input.detailInfo;
        if (input.search) {
            html += "<div class=\"pull-right search\">             \n                    <div class=\"input-group stylish-input-group\">\n                        <input class=\"form-control\" placeholder=\"Search\" (keyup)=\"detailSearch(" + fieldName + "search.value, '" + fieldName + "')\" #" + fieldName + "search type=\"text\">\n                        <span class=\"input-group-addon\">                        \n                                <span class=\"fa fa-search\"></span>                         \n                        </span>\n                    </div>            \n                </div>";
        }
        html += "</div>\n            <div *ngFor=\"let item of model." + fieldName + "\">\n                <juForm viewMode=\"form\" *ngIf=\"!item.removed\" [model]=\"item\" [options]=\"" + config + ".options\">\n              \n                </juForm>\n            </div>\n        ";
        return html;
    };
    juForm.prototype._getjuSelectTemplate = function (fieldName, input, config) {
        var labelSize = input.labelSize || this.options.labelSize || 3, labelPos = input.labelPos || this.options.labelPos || 'top', cfield = fieldName.split('.').join('_'), element = "<juSelect\n                    [myForm]=\"myForm\"\n                    [config]=\"" + config + "\"                     \n                    #" + cfield + "select \n                    (option-change)=\"" + config + ".change($event)\"                                \n                    [disabled]=\"" + config + ".disabled\"\n                    [hide-search]=\"" + (input.search ? 'false' : 'true') + "\" \n                    method=\"" + (input.method || 'getValues') + "\" \n                    [model]=\"model\"                     \n                    property-name=\"" + fieldName + "\" \n                    view-mode=\"" + (input.viewMode || 'select') + "\" \n                    [data-src]=\"" + config + ".data\">\n                </juSelect>                \n                <div *ngIf=\"" + cfield + "select.hasError()\" class=\"alert alert-danger\" [innerHTML]=\"" + config + ".message\"></div>";
        return this.getHtml(input, element, fieldName, labelPos, labelSize);
    };
    juForm.prototype._getInputTemplate = function (fieldName, input, config) {
        var labelSize = input.labelSize || this.options.labelSize || 3, labelPos = input.labelPos || this.options.labelPos || 'top', cfield = fieldName.split('.').join('_');
        input.type = input.type || 'text';
        var element = (input.type === 'textarea') ?
            "<textarea (keyup)=\"vlidate_input(model." + fieldName + ", " + config + ")\" [disabled]=\"" + config + ".disabled\" [(ngModel)]=\"model." + fieldName + "\" class=\"form-control " + cfield + "\" placeholder=\"Enter " + (input.label || fieldName) + "\"></textarea>"
            :
                "<input type=\"" + input.type + "\" (keyup)=\"vlidate_input(model." + fieldName + ", " + config + ")\" [disabled]=\"" + config + ".disabled\"   [(ngModel)]=\"model." + fieldName + "\" class=\"form-control " + cfield + "\" placeholder=\"Enter " + (input.label || fieldName) + "\">\n            <div *ngIf=\"!" + config + ".hideMsg\" class=\"alert alert-danger\" [innerHTML]=\"" + config + ".message\"></div>";
        if (this.viewMode === 'table') {
            return "<td>" + element + "</td>";
        }
        return this.getHtml(input, element, fieldName, labelPos, labelSize);
    };
    juForm.prototype.getColOffset = function (input) {
        return input.offset ? " col-md-offset-" + input.offset : '';
    };
    juForm.prototype.getRequiredInfo = function (field) {
        return field.validators ? '<span class="required" title="This field is required.">*</span>' : '';
    };
    juForm.prototype._getFileTemplate = function (fieldName, input, config) {
        var labelSize = input.labelSize || this.options.labelSize || 3, labelPos = input.labelPos || this.options.labelPos || 'top', cfield = fieldName.split('.').join('_'), element = "<input type=\"file\" fileSelect [model]=\"model\" propName=\"" + fieldName + "\" [ext]=\"" + config + ".ext\" " + (input.multiple ? 'multiple' : '') + " (click)=\"vlidate_input(model." + fieldName + ", " + config + ")\" [form]=\"myForm\" [config]=\"" + config + "\" [disabled]=\"" + config + ".disabled\" class=\"form-control\" placeholder=\"Select file(s)...\">\n                    <div *ngIf=\"!" + config + ".hideMsg\" class=\"alert alert-danger\" [innerHTML]=\"" + config + ".message\"></div>";
        return this.getHtml(input, element, fieldName, labelPos, labelSize);
    };
    juForm.prototype._getCkEditorTemplate = function (fieldName, input, config) {
        var labelSize = input.labelSize || this.options.labelSize || 3, labelPos = input.labelPos || this.options.labelPos || 'top', cfield = fieldName.split('.').join('_'), element = "<textarea ckeditor [config]=\"" + config + "\" (click)=\"fieldClick('" + fieldName + "', " + config + ")\" [disabled]=\"" + config + ".disabled\" [(ngModel)]=\"model." + fieldName + "\" class=\"form-control\" placeholder=\"Enter " + (input.label || fieldName) + "\"></textarea>\n                 <div *ngIf=\"!" + config + ".hideMsg\" class=\"alert alert-danger\" [innerHTML]=\"" + config + ".message\"></div>";
        return this.getHtml(input, element, fieldName, labelPos, labelSize);
    };
    juForm.prototype._getDateTemplate = function (fieldName, input, config) {
        var labelSize = input.labelSize || this.options.labelSize || 3, labelPos = input.labelPos || this.options.labelPos || 'top', cfield = fieldName.split('.').join('_'), element = "<div (click)=\"vlidate_input(model." + fieldName + ", " + config + ")\" class=\"input-group date\" [pickers]=\"" + config + ".config\" picker-name=\"" + input.type + "\" [model]=\"model\" property=\"" + fieldName + "\" [config]=\"" + config + "\" [form]=\"myForm\" >\n                        <input type=\"text\" [disabled]=\"" + config + ".disabled\" [(ngModel)]=\"model." + fieldName + "\" class=\"form-control\" placeholder=\"Enter " + (input.label || fieldName) + "\">\n                        <span class=\"input-group-addon\">\n                            <span class=\"fa fa-calendar\"></span>\n                        </span>\n                    </div>                    \n                    <div *ngIf=\"!" + config + ".hideMsg\" class=\"alert alert-danger\" [innerHTML]=\"" + config + ".message\"></div>";
        return this.getHtml(input, element, fieldName, labelPos, labelSize);
    };
    juForm.prototype._getSelectTemplate = function (fieldName, input, config) {
        var labelSize = input.labelSize || this.options.labelSize || 3, labelPos = input.labelPos || this.options.labelPos || 'top', cfield = fieldName.split('.').join('_'), element = "<select (click)=\"vlidate_input(model." + fieldName + ", " + config + ")\" (change)=\"" + config + ".change({value:" + cfield + ".value, sender:" + cfield + ", form:myForm})\" #" + cfield + " [disabled]=\"" + config + ".disabled\" [(ngModel)]=\"model." + fieldName + "\" class=\"form-control " + cfield + "\">\n                            <option value=\"\">{{" + config + ".emptyOptionText||'Select option'}}</option>\n                            <option *ngFor=\"let v of " + config + ".data\" [value]=\"v.value\">{{v.name}}</option>\n                        </select>\n                        <div *ngIf=\"!" + config + ".hideMsg\" class=\"alert alert-danger\" [innerHTML]=\"" + config + ".message\"></div>";
        return this.getHtml(input, element, fieldName, labelPos, labelSize);
    };
    juForm.prototype.getHtml = function (input, element, fieldName, labelPos, labelSize) {
        var label = (input.label || fieldName) + this.getRequiredInfo(input);
        if (this.isVertical) {
            return labelPos === 'top' ?
                "<div class=\"form-group\" " + input.exp + ">\n                        <label>" + label + "</label>                        \n                        " + element + "                        \n                </div>" :
                "<div class=\"form-group\" " + input.exp + ">\n                            <label class=\"col-md-" + labelSize + " control-label\">" + label + "</label>                        \n                            <div class=\"col-md-" + (12 - labelSize) + "\"> " + element + "  </div>                      \n                </div>";
        }
        return labelPos === 'top' ?
            "<div class=\"col-md-" + input.size + this.getColOffset(input) + "\" " + input.exp + ">\n                        <label class=\"control-label\">" + label + "</label>                                               \n                        " + element + "\n            </div>" :
            "<div class=\"col-md-" + input.size + this.getColOffset(input) + "\" " + input.exp + ">\n                <div class=\"form-group\">\n                    <label class=\"col-md-" + labelSize + " control-label\">" + label + "</label>                                               \n                    <div class=\"col-md-" + (12 - labelSize) + "\"> " + element + "  </div>\n                </div>       \n            </div>";
    };
    juForm.FORM_LIST = new Map();
    __decorate([
        core_1.Input('viewMode'), 
        __metadata('design:type', String)
    ], juForm.prototype, "viewMode", void 0);
    __decorate([
        core_1.Input('model'), 
        __metadata('design:type', Object)
    ], juForm.prototype, "model", void 0);
    __decorate([
        core_1.Input('options'), 
        __metadata('design:type', Object)
    ], juForm.prototype, "options", void 0);
    __decorate([
        core_1.Input('panelMode'), 
        __metadata('design:type', String)
    ], juForm.prototype, "panelMode", void 0);
    __decorate([
        core_1.Output('onModalClose'), 
        __metadata('design:type', Object)
    ], juForm.prototype, "onModalClose", void 0);
    __decorate([
        core_1.Output('onLoad'), 
        __metadata('design:type', Object)
    ], juForm.prototype, "onLoad", void 0);
    juForm = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'juForm,[juForm],.juForm',
            encapsulation: core_1.ViewEncapsulation.None,
            template: '<div></div>',
            styleUrls: ['./juForm.css'],
            changeDetection: core_1.ChangeDetectionStrategy.Default
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.DynamicComponentLoader, core_1.ViewContainerRef])
    ], juForm);
    return juForm;
}());
exports.juForm = juForm;
function getComponent(obj) {
    var DynamicComponent = (function () {
        function DynamicComponent(el) {
            this.el = el;
            this.model = {};
            this.config = {};
            this.active = '';
            this.tabName = '';
            this.myForm = {};
            this.slideState = 'down';
            this._sh = {};
            this.message = '';
            this.messageCss = '';
        }
        DynamicComponent.prototype.ngOnInit = function () {
            var _this = this;
            if (this.config.viewMode === 'popup') {
                jQuery(this.el.nativeElement).find('.modal').on('hidden.bs.modal', function (e) {
                    _this.config.onModalClose.next(null);
                });
                if ('width' in this.config) {
                    jQuery(this.el.nativeElement).find('.modal-dialog').css('width', this.config.width);
                }
            }
        };
        DynamicComponent.prototype.slideToggle = function () {
            jQuery(this.el.nativeElement).find('.panel-body').slideToggle();
            this.slideState = this.slideState === 'down' ? 'up' : 'down';
        };
        DynamicComponent.prototype.setModel = function (model) {
            this.model = model;
            var _loop_1 = function(prop) {
                var dmodel = model, arr = prop.split('.');
                var field = this_1.config._events[prop].field;
                arr.forEach(function (it) { return dmodel = dmodel[it]; });
                if (field.type === 'select' && typeof dmodel === 'undefined') {
                    if (arr.length > 1) {
                        var obj_1 = model, len = arr.length - 1;
                        for (i = 0; i < len; i++) {
                            obj_1 = obj_1[arr[i]];
                        }
                        obj_1[arr[i]] = dmodel || '';
                    }
                    else {
                        model[prop] = dmodel || '';
                    }
                }
                else if (field.type === 'juSelect') {
                    if (typeof dmodel === 'undefined') {
                        async_call(function () { field.api.checkAll(false); });
                    }
                    else {
                        async_call(function () { field.api.value = dmodel; });
                    }
                }
                else if (field.type === 'datepicker' && dmodel) {
                    async_call(function () { field.api.setDate(dmodel); });
                }
                else if (field.type === 'ckeditor' && dmodel) {
                    async_call(function () { field.api.setData(dmodel); });
                }
                this_1.vlidate_input(dmodel, field, true);
            };
            var this_1 = this;
            var i;
            for (var prop in this.config._events) {
                _loop_1(prop);
            }
        };
        DynamicComponent.prototype.getModel = function () {
            for (var prop in this._sh) {
                this.model[prop] = this._sh[prop];
            }
            for (var prop_1 in this.config._events) {
                var item = this.config._events[prop_1].field;
                if (item.type === 'ckeditor') {
                    if (item.field.indexOf('.') !== -1) {
                        var arr = item.field.split('.'), len = arr.length - 1, obj_2 = this.model;
                        for (var i = 0; i < len; i++) {
                            obj_2 = obj_2[arr[i]];
                        }
                        obj_2[arr[i]] = item.api.getData();
                    }
                    else {
                        this.model[item.field] = item.api.getData();
                    }
                }
            }
            return this.model;
        };
        DynamicComponent.prototype.valueChanges = function (key) {
            return this.form.controls[key].valueChanges;
        };
        DynamicComponent.prototype.syncModel = function (type) {
            var _this = this;
            if (type === void 0) { type = 'set'; }
            if (this.config.inputs) {
                var item_1 = getItem(this.config.inputs, function (x) { return x.type === 'ckeditor'; });
                if (item_1) {
                    if (type == 'get') {
                        this.model[item_1.field] = item_1.api.getData();
                    }
                    else {
                        var tid_1 = setTimeout(function () {
                            item_1.api.setData(_this.model[item_1.field]);
                            clearTimeout(tid_1);
                        }, 0);
                    }
                }
            }
            else if (this.config.tabs) {
                var _loop_2 = function() {
                    var item = getItem(this_2.config.tabs[tabName], function (x) { return x.type === 'ckeditor'; });
                    if (item) {
                        if (type == 'get') {
                            this_2.model[item.field] = item.api.getData();
                        }
                        else {
                            var tid_2 = setTimeout(function () {
                                item.api.setData(_this.model[item.field]);
                                clearTimeout(tid_2);
                            }, 0);
                        }
                    }
                };
                var this_2 = this;
                for (var tabName in this.config.tabs) {
                    _loop_2();
                }
            }
        };
        DynamicComponent.prototype.isTabEnable = function (tabName, tab) {
            if (tab) {
                var tabConfig = tab.find(function (tc) { return tc.tabConfig; });
                if (tabConfig) {
                    try {
                        return tabConfig.enable(this.form, this.model);
                    }
                    catch (ex) {
                        return false;
                    }
                }
                return true;
            }
        };
        DynamicComponent.prototype.tabClick = function (tabName, e, tab) {
            this.tabName = tabName;
            if (e) {
                e.preventDefault();
            }
            if (!this.isTabEnable(tabName, tab)) {
                return;
            }
            if (tab) {
                var tbn_1 = tabName.replace(/\s+/g, ''), parent_1 = jQuery(this.el.nativeElement).find('div.' + tbn_1).parent('.tabs'), tabs = parent_1.children();
                parent_1.prev().children().each(function (index, el) {
                    var li = jQuery(el);
                    li.attr('name') === tabName ? li.addClass('active') : li.removeClass('active');
                });
                tabs.each(function (index, el) {
                    var tabel = jQuery(el);
                    tabel.hasClass(tbn_1) ? tabel.show() : tabel.hide();
                });
            }
            this.active = tabName;
            this.acriveTab = tab;
            this.focus();
        };
        DynamicComponent.prototype.setConfig = function (options, mform) {
            this.config = options;
            this.myForm = mform;
        };
        DynamicComponent.prototype.isActive = function (tabName) {
            return this.active === tabName;
        };
        DynamicComponent.prototype.focus = function () {
            var inputs = [];
            if (this.active) {
                inputs = jQuery(this.el.nativeElement).find('div.' + this.active.replace(/\s+/g, '')).find('input');
            }
            else {
                inputs = jQuery(this.el.nativeElement).find('input');
            }
            if (inputs.length >= 1) {
                jQuery(inputs[0]).focus();
            }
        };
        DynamicComponent.prototype.fieldClick = function (fieldName, field) {
            if (field) {
                field.hideMsg = false;
            }
        };
        DynamicComponent.prototype.vlidate_input = function (val, field, internal) {
            if (internal === void 0) { internal = false; }
            field.hideMsg = true;
            if (field.validators) {
                if (Array.isArray(field.validators) && field.validators.length > 0) {
                    var len = field.validators.length, i = 0;
                    while (i < len && this.vlidate_input_helper(val, field, field.validators[i], internal)) {
                        i++;
                    }
                }
                else if (typeof field.validators === 'function') {
                    this.vlidate_input_helper(val, field, field.validators, internal);
                }
            }
        };
        DynamicComponent.prototype.vlidate_input_helper = function (val, field, fx, internal) {
            var msg = fx(val, field.label || field.field);
            if (typeof msg === 'string') {
                field.message = msg;
                field.hideMsg = false;
            }
            else {
                field.hideMsg = msg;
            }
            this.config._events[field.field].hideMsg = field.hideMsg;
            if (internal) {
                field.hideMsg = true;
            }
            return field.hideMsg;
        };
        DynamicComponent.prototype.isValid = function () {
            for (var prop in this.config._events) {
                if (!this.config._events[prop].hideMsg) {
                    return false;
                }
            }
            return true;
        };
        DynamicComponent.prototype.hideValidationMessage = function (flag) {
            if (flag === void 0) { flag = true; }
            if (this.tabName) {
                this.__setValidationFlag(this.acriveTab, flag);
            }
            else {
                this.__setValidationFlag(this.config.inputs, flag);
            }
        };
        DynamicComponent.prototype.__setValidationFlag = function (arr, flag) {
            var _this = this;
            if (arr) {
                arr.forEach(function (item) {
                    if (Array.isArray(item)) {
                        _this.__setValidationFlag(item, flag);
                    }
                    else {
                        item.hideMsg = flag;
                    }
                });
            }
        };
        DynamicComponent.prototype.AddNewItem = function (list, fieldName) {
            list.unshift(this._getRefreshObject(fieldName));
            this._sh[fieldName] = list;
        };
        DynamicComponent.prototype.detailSearch = function (value, fieldName) {
            if (!this._sh[fieldName]) {
                this._sh[fieldName] = this.model[fieldName];
            }
            if (!value) {
                this.model[fieldName] = this._sh[fieldName];
            }
            var list = this._sh[fieldName];
            var filterPops = this._getFilterProps(fieldName);
            var res = [];
            value = value.toLowerCase();
            list.forEach(function (item) {
                for (var index = 0; index < filterPops.length; index++) {
                    if (item[filterPops[index]] && item[filterPops[index]].toString().toLowerCase().indexOf(value) != -1) {
                        res.push(item);
                        break;
                    }
                }
            });
            this.model[fieldName] = res;
        };
        DynamicComponent.prototype._getRefreshObject = function (fieldName) {
            if (this.config.inputs) {
                var item = getItem(this.config.inputs, function (it) { return it.field === fieldName && it.type == 'detail'; });
                if (item && item.options.refreshBy) {
                    return Object.assign({}, item.options.refreshBy);
                }
            }
            else if (this.config.tabs) {
                for (var tabName in this.config.tabs) {
                    var item = getItem(this.config.tabs[tabName], function (it) { return it.field === fieldName && it.type == 'detail'; });
                    if (item && item.options.refreshBy) {
                        return Object.assign({}, item.options.refreshBy);
                    }
                }
            }
            return {};
        };
        DynamicComponent.prototype._getFilterProps = function (fieldName) {
            if (this.config.inputs) {
                var item = getItem(this.config.inputs, function (it) { return it.field === fieldName && it.type == 'detail'; });
                if (item && item.options.filter) {
                    return item.options.filter;
                }
            }
            else if (this.config.tabs) {
                for (var tabName in this.config.tabs) {
                    var item = getItem(this.config.tabs[tabName], function (it) { return it.field === fieldName && it.type == 'detail'; });
                    if (item && item.options.filter) {
                        return item.options.filter;
                    }
                }
            }
            return [];
        };
        DynamicComponent.prototype.showMessage = function (message, messageCss) {
            if (messageCss === void 0) { messageCss = 'alert alert-info'; }
            this.message = message;
            this.messageCss = messageCss;
        };
        DynamicComponent = __decorate([
            core_1.Component({
                selector: 'dynamic-form',
                template: obj.tpl
            }), 
            __metadata('design:paramtypes', [core_1.ElementRef])
        ], DynamicComponent);
        return DynamicComponent;
    }());
    return DynamicComponent;
}
function getItem(arr, exp) {
    for (var index = 0; index < arr.length; index++) {
        if (Array.isArray(arr[index])) {
            var temp = getItem(arr[index], exp);
            if (temp) {
                return temp;
            }
        }
        else if (arr[index].type === 'groupLayout') {
            var item = arr[index];
            if (item.items) {
                var temp = getGroupLayoutItem(item, exp);
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
function getGroupLayoutItem(item, exp) {
    for (var ri = 0; ri < item.items.length; ri++) {
        if (Array.isArray(item.items[ri])) {
            for (var gi = 0; gi < item.items[ri].length; gi++) {
                var group = item.items[ri][gi];
                if (group.inputs) {
                    var temp = getItem(group.inputs, exp);
                    if (temp) {
                        return temp;
                    }
                }
                else if (group.tabs) {
                    for (var tabName in group.tabs) {
                        var temp = getItem(group.tabs[tabName], exp);
                        if (temp) {
                            return temp;
                        }
                    }
                }
                else if (group.items) {
                    var temp = getGroupLayoutItem(group, exp);
                    if (temp) {
                        return temp;
                    }
                }
            }
        }
    }
    return null;
}
function async_call(fx, time) {
    if (time === void 0) { time = 0; }
    var tid = setTimeout(function () {
        fx();
        clearTimeout(tid);
    }, time);
}
//# sourceMappingURL=juForm.js.map