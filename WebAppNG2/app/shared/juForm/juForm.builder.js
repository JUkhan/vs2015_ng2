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
var compiler_1 = require('@angular/compiler');
var shared_module_1 = require('../shared.module');
var juFormBuilder = (function () {
    function juFormBuilder(compiler) {
        this.compiler = compiler;
        this.tabid = 0;
        this.isTab = false;
        this.activeTabs = {};
    }
    juFormBuilder.prototype.getTemplate = function () {
        var template = [], obj = {};
        if (this.options.viewMode === 'panel') {
            template.push("<div class=\"panel panel-" + this.options.panelMode + "\">\n            <div class=\"panel-heading\" style=\"cursor:pointer\" (click)=\"slideToggle()\">\n                <h3 class=\"panel-title\">{{config.title}} <b class=\"pull-right fa fa-{{slideState==='down'?'minus':'plus'}}-circle\"></b></h3>\n            </div>\n            <div class=\"panel-body\">\n            <div [style.display]=\"message?'block':'none'\" [class]=\"messageCss\">{{message}}</div>       \n            ");
        }
        else if (this.options.viewMode === 'popup') {
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
        if (this.options.viewMode == 'panel') {
            template.push("</div></div>");
        }
        else if (this.options.viewMode == 'popup') {
            template.push("</div></div></div></div>");
        }
        return template.join('');
    };
    juFormBuilder.prototype._setInputs = function (obj, template, inputArr, refPath, isRow) {
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
    juFormBuilder.prototype.resolveGroupLayout = function (item, refPath, index, obj, template, isNested) {
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
    juFormBuilder.prototype.resolveGroup = function (group, groupTpl, gref, gindex, index, labelPos, labelSize, obj) {
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
    juFormBuilder.prototype.getGroupInputs = function (obj, ref, group) {
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
    juFormBuilder.prototype._setButtons = function (obj, template) {
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
    juFormBuilder.prototype._getGroupConfig = function (input) {
        var group = [''];
        return group;
    };
    juFormBuilder.prototype._getDetailTemplate = function (fieldName, input, config) {
        var html = '';
        html += "\n            <div class=\"form-detail\">\n                <button class=\"btn btn-success\" title=\"Add a new item\" (click)=\"AddNewItem(model." + fieldName + ", '" + fieldName + "')\"> <b class=\"fa fa-plus-circle\"></b> New Item</button>\n                " + input.detailInfo;
        if (input.search) {
            html += "<div class=\"pull-right search\">             \n                    <div class=\"input-group stylish-input-group\">\n                        <input class=\"form-control\" placeholder=\"Search\" (keyup)=\"detailSearch(" + fieldName + "search.value, '" + fieldName + "')\" #" + fieldName + "search type=\"text\">\n                        <span class=\"input-group-addon\">                        \n                                <span class=\"fa fa-search\"></span>                         \n                        </span>\n                    </div>            \n                </div>";
        }
        html += "</div>\n            <div *ngFor=\"let item of model." + fieldName + "\">\n                <juForm viewMode=\"form\" *ngIf=\"!item.removed\" [model]=\"item\" [options]=\"" + config + ".options\">\n              \n                </juForm>\n            </div>\n        ";
        return html;
    };
    juFormBuilder.prototype._getjuSelectTemplate = function (fieldName, input, config) {
        var labelSize = input.labelSize || this.options.labelSize || 3, labelPos = input.labelPos || this.options.labelPos || 'top', cfield = fieldName.split('.').join('_'), element = "<juSelect\n                    [myForm]=\"myForm\"\n                    [config]=\"" + config + "\"                     \n                    #" + cfield + "select \n                    (option-change)=\"" + config + ".change($event)\"\n                    [model]=\"model\"                     \n                    property-name=\"" + fieldName + "\"\n                    [data]=\"" + config + ".data\" \n                    [options]=\"" + config + ".options||{}\"                   \n                    >\n                </juSelect>                \n                <div *ngIf=\"" + cfield + "select.hasError()\" class=\"alert alert-danger\" [innerHTML]=\"" + config + ".message\"></div>";
        return this.getHtml(input, element, fieldName, labelPos, labelSize);
    };
    juFormBuilder.prototype._getInputTemplate = function (fieldName, input, config) {
        var labelSize = input.labelSize || this.options.labelSize || 3, labelPos = input.labelPos || this.options.labelPos || 'top', cfield = fieldName.split('.').join('_');
        input.type = input.type || 'text';
        var element = (input.type === 'textarea') ?
            "<textarea (keyup)=\"vlidate_input(model." + fieldName + ", " + config + ")\" [disabled]=\"" + config + ".disabled\" [(ngModel)]=\"model." + fieldName + "\" class=\"form-control " + cfield + "\" placeholder=\"Enter " + (input.label || fieldName) + "\"></textarea>"
            :
                "<input type=\"" + input.type + "\" (keyup)=\"vlidate_input(model." + fieldName + ", " + config + ")\" [disabled]=\"" + config + ".disabled\"   [(ngModel)]=\"model." + fieldName + "\" class=\"form-control " + cfield + "\" placeholder=\"Enter " + (input.label || fieldName) + "\">\n            <div *ngIf=\"!" + config + ".hideMsg\" class=\"alert alert-danger\" [innerHTML]=\"" + config + ".message\"></div>";
        if (this.options.viewMode === 'table') {
            return "<td>" + element + "</td>";
        }
        return this.getHtml(input, element, fieldName, labelPos, labelSize);
    };
    juFormBuilder.prototype.getColOffset = function (input) {
        return input.offset ? " col-md-offset-" + input.offset : '';
    };
    juFormBuilder.prototype.getRequiredInfo = function (field) {
        return field.validators ? '<span class="required" title="This field is required.">*</span>' : '';
    };
    juFormBuilder.prototype._getFileTemplate = function (fieldName, input, config) {
        var labelSize = input.labelSize || this.options.labelSize || 3, labelPos = input.labelPos || this.options.labelPos || 'top', cfield = fieldName.split('.').join('_'), element = "<input type=\"file\" fileSelect [model]=\"model\" propName=\"" + fieldName + "\" [ext]=\"" + config + ".ext\" " + (input.multiple ? 'multiple' : '') + " (click)=\"vlidate_input(model." + fieldName + ", " + config + ")\" [form]=\"myForm\" [config]=\"" + config + "\" [disabled]=\"" + config + ".disabled\" class=\"form-control\" placeholder=\"Select file(s)...\">\n                    <div *ngIf=\"!" + config + ".hideMsg\" class=\"alert alert-danger\" [innerHTML]=\"" + config + ".message\"></div>";
        return this.getHtml(input, element, fieldName, labelPos, labelSize);
    };
    juFormBuilder.prototype._getCkEditorTemplate = function (fieldName, input, config) {
        var labelSize = input.labelSize || this.options.labelSize || 3, labelPos = input.labelPos || this.options.labelPos || 'top', cfield = fieldName.split('.').join('_'), element = "<textarea ckeditor [config]=\"" + config + "\" (click)=\"fieldClick('" + fieldName + "', " + config + ")\" [disabled]=\"" + config + ".disabled\" [(ngModel)]=\"model." + fieldName + "\" class=\"form-control\" placeholder=\"Enter " + (input.label || fieldName) + "\"></textarea>\n                 <div *ngIf=\"!" + config + ".hideMsg\" class=\"alert alert-danger\" [innerHTML]=\"" + config + ".message\"></div>";
        return this.getHtml(input, element, fieldName, labelPos, labelSize);
    };
    juFormBuilder.prototype._getDateTemplate = function (fieldName, input, config) {
        var labelSize = input.labelSize || this.options.labelSize || 3, labelPos = input.labelPos || this.options.labelPos || 'top', cfield = fieldName.split('.').join('_'), element = "<div (click)=\"vlidate_input(model." + fieldName + ", " + config + ")\" class=\"input-group date\" [pickers]=\"" + config + ".config\" picker-name=\"" + input.type + "\" [model]=\"model\" property=\"" + fieldName + "\" [config]=\"" + config + "\" [form]=\"myForm\" >\n                        <input type=\"text\" [disabled]=\"" + config + ".disabled\" [(ngModel)]=\"model." + fieldName + "\" class=\"form-control\" placeholder=\"Enter " + (input.label || fieldName) + "\">\n                        <span class=\"input-group-addon\">\n                            <span class=\"fa fa-calendar\"></span>\n                        </span>\n                    </div>                    \n                    <div *ngIf=\"!" + config + ".hideMsg\" class=\"alert alert-danger\" [innerHTML]=\"" + config + ".message\"></div>";
        return this.getHtml(input, element, fieldName, labelPos, labelSize);
    };
    juFormBuilder.prototype._getSelectTemplate = function (fieldName, input, config) {
        var labelSize = input.labelSize || this.options.labelSize || 3, labelPos = input.labelPos || this.options.labelPos || 'top', cfield = fieldName.split('.').join('_'), element = "<select (click)=\"vlidate_input(model." + fieldName + ", " + config + ")\" (change)=\"" + config + ".change({value:" + cfield + ".value, sender:" + cfield + ", form:myForm})\" #" + cfield + " [disabled]=\"" + config + ".disabled\" [(ngModel)]=\"model." + fieldName + "\" class=\"form-control " + cfield + "\">\n                            <option value=\"\">{{" + config + ".emptyOptionText||'Select option'}}</option>\n                            <option *ngFor=\"let v of " + config + ".data\" [value]=\"v.value\">{{v.name}}</option>\n                        </select>\n                        <div *ngIf=\"!" + config + ".hideMsg\" class=\"alert alert-danger\" [innerHTML]=\"" + config + ".message\"></div>";
        return this.getHtml(input, element, fieldName, labelPos, labelSize);
    };
    juFormBuilder.prototype.getHtml = function (input, element, fieldName, labelPos, labelSize) {
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
    juFormBuilder.prototype.createComponentFactory = function (options) {
        var _this = this;
        this.options = options;
        var tpl = this.getTemplate();
        options.isTab = this.isTab;
        options.activeTabs = this.activeTabs;
        var type = this.createNewComponent(tpl);
        var module = this.createComponentModule(type);
        return new Promise(function (resolve) {
            _this.compiler
                .compileModuleAndAllComponentsAsync(module)
                .then(function (moduleWithFactories) {
                resolve(_.find(moduleWithFactories.componentFactories, { componentType: type }));
            });
        });
    };
    juFormBuilder.prototype.createNewComponent = function (tmpl) {
        var DynamicFormComponent = (function () {
            function DynamicFormComponent(el) {
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
            DynamicFormComponent.prototype.ngOnInit = function () {
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
            DynamicFormComponent.prototype.slideToggle = function () {
                jQuery(this.el.nativeElement).find('.panel-body').slideToggle();
                this.slideState = this.slideState === 'down' ? 'up' : 'down';
            };
            DynamicFormComponent.prototype.setModel = function (model) {
                this.model = model;
                var _loop_1 = function(prop) {
                    var dmodel = model, arr = prop.split('.');
                    var field = this_1.config._events[prop].field;
                    arr.forEach(function (it) { return dmodel = dmodel[it]; });
                    if (field.type === 'select' && typeof dmodel === 'undefined') {
                        if (arr.length > 1) {
                            var obj = model, len = arr.length - 1;
                            for (i = 0; i < len; i++) {
                                obj = obj[arr[i]];
                            }
                            obj[arr[i]] = dmodel || '';
                        }
                        else {
                            model[prop] = dmodel || '';
                        }
                    }
                    else if (field.type === 'juSelect') {
                        if (field.api) {
                            field.api.setValue(dmodel);
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
            DynamicFormComponent.prototype.getModel = function () {
                for (var prop in this._sh) {
                    this.model[prop] = this._sh[prop];
                }
                for (var prop_1 in this.config._events) {
                    var item = this.config._events[prop_1].field;
                    if (item.type === 'ckeditor') {
                        if (item.field.indexOf('.') !== -1) {
                            var arr = item.field.split('.'), len = arr.length - 1, obj = this.model;
                            for (var i = 0; i < len; i++) {
                                obj = obj[arr[i]];
                            }
                            obj[arr[i]] = item.api.getData();
                        }
                        else {
                            this.model[item.field] = item.api.getData();
                        }
                    }
                }
                return this.model;
            };
            DynamicFormComponent.prototype.valueChanges = function (key) {
                return this.form.controls[key].valueChanges;
            };
            DynamicFormComponent.prototype.isTabEnable = function (tabName, tab) {
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
            DynamicFormComponent.prototype.tabClick = function (tabName, e, tab) {
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
            DynamicFormComponent.prototype.setConfig = function (options, mform) {
                this.config = options;
                this.myForm = mform;
            };
            DynamicFormComponent.prototype.isActive = function (tabName) {
                return this.active === tabName;
            };
            DynamicFormComponent.prototype.focus = function () {
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
            DynamicFormComponent.prototype.fieldClick = function (fieldName, field) {
                if (field) {
                    field.hideMsg = false;
                }
            };
            DynamicFormComponent.prototype.vlidate_input = function (val, field, internal) {
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
            DynamicFormComponent.prototype.vlidate_input_helper = function (val, field, fx, internal) {
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
            DynamicFormComponent.prototype.isValid = function () {
                for (var prop in this.config._events) {
                    if (!this.config._events[prop].hideMsg) {
                        return false;
                    }
                }
                return true;
            };
            DynamicFormComponent.prototype.hideValidationMessage = function (flag) {
                if (flag === void 0) { flag = true; }
                if (this.tabName) {
                    this.__setValidationFlag(this.acriveTab, flag);
                }
                else {
                    this.__setValidationFlag(this.config.inputs, flag);
                }
            };
            DynamicFormComponent.prototype.__setValidationFlag = function (arr, flag) {
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
            DynamicFormComponent.prototype.AddNewItem = function (list, fieldName) {
                list.unshift(this._getRefreshObject(fieldName));
                this._sh[fieldName] = list;
            };
            DynamicFormComponent.prototype.detailSearch = function (value, fieldName) {
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
            DynamicFormComponent.prototype._getRefreshObject = function (fieldName) {
                var item = this.config._events[fieldName].field;
                if (item && item.options.refreshBy) {
                    return Object.assign({}, item.options.refreshBy);
                }
                return {};
            };
            DynamicFormComponent.prototype._getFilterProps = function (fieldName) {
                var item = this.config._events[fieldName].field;
                if (item && item.options.filter) {
                    return item.options.filter;
                }
                return [];
            };
            DynamicFormComponent.prototype.showMessage = function (message, messageCss) {
                if (messageCss === void 0) { messageCss = 'alert alert-info'; }
                this.message = message;
                this.messageCss = messageCss;
            };
            DynamicFormComponent = __decorate([
                core_1.Component({
                    selector: 'dynamic-form',
                    template: tmpl,
                }), 
                __metadata('design:paramtypes', [core_1.ElementRef])
            ], DynamicFormComponent);
            return DynamicFormComponent;
        }());
        ;
        return DynamicFormComponent;
    };
    juFormBuilder.prototype.createComponentModule = function (componentType) {
        var RuntimeComponentModuleForJuForm = (function () {
            function RuntimeComponentModuleForJuForm() {
            }
            RuntimeComponentModuleForJuForm = __decorate([
                core_1.NgModule({
                    imports: [
                        shared_module_1.SharedModule
                    ],
                    declarations: [
                        componentType
                    ],
                }), 
                __metadata('design:paramtypes', [])
            ], RuntimeComponentModuleForJuForm);
            return RuntimeComponentModuleForJuForm;
        }());
        return RuntimeComponentModuleForJuForm;
    };
    juFormBuilder = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [compiler_1.RuntimeCompiler])
    ], juFormBuilder);
    return juFormBuilder;
}());
exports.juFormBuilder = juFormBuilder;
function async_call(fx, time) {
    if (time === void 0) { time = 0; }
    var tid = setTimeout(function () { fx(); clearTimeout(tid); }, time);
}
//# sourceMappingURL=juForm.builder.js.map