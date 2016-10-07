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
var FV_1 = require('../juForm/FV');
var MailComponent = (function () {
    function MailComponent() {
        this.title = 'Health Care Regulatory System';
        this.onSend = new core_1.EventEmitter();
        this.onLoad = new core_1.EventEmitter();
    }
    MailComponent.prototype.ngOnInit = function () { this.constructForm(); };
    MailComponent.prototype.ngOnChanges = function (changes) {
    };
    MailComponent.prototype.fromLoad = function (form) {
        this.form = form;
        this.onLoad.emit(this);
    };
    MailComponent.prototype.constructForm = function () {
        var _this = this;
        this.formOptions = {
            title: this.title, viewMode: 'popup', labelPos: 'left', labelSize: 4,
            body: '',
            inputs: [
                { field: 'to', label: 'To', type: 'juSelect', validators: [FV_1.FV.required, FV_1.FV.email()], options: { editable: true, width: '100%' } },
                { field: 'subject', label: 'Subject', type: 'text', validators: FV_1.FV.required },
                { field: 'attachment', label: 'Attachment Name', type: 'text' },
                { type: 'html', content: '<div><textarea [(ngModel)]="config.body" rows=10 style="width:100%"></textarea></div>' }
            ],
            buttons: {
                'Send': {
                    type: 'submit', click: function () {
                        _this.onSend.emit(_this.getModel());
                        _this.hide();
                    }
                },
                'Cancel': { type: 'close' }
            }
        };
    };
    MailComponent.prototype.show = function () {
        this.form.showModal();
    };
    MailComponent.prototype.hide = function () {
        this.form.showModal(false);
        this.form.refresh();
        this.formOptions['body'] = '';
    };
    MailComponent.prototype.getModel = function () {
        var model = this.form.getModel();
        model.body = this.formOptions['body'];
        return model;
    };
    MailComponent.prototype.setAttachment = function (attachment) {
        this.form.getModel().attachment = attachment;
    };
    MailComponent.prototype.setMailList = function (data) {
        this.form.setData('to', data);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MailComponent.prototype, "title", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], MailComponent.prototype, "onSend", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], MailComponent.prototype, "onLoad", void 0);
    MailComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'mail, [mail], .mail',
            template: '<div juForm (onLoad)="fromLoad($event)" [options]="formOptions"></div>'
        }), 
        __metadata('design:paramtypes', [])
    ], MailComponent);
    return MailComponent;
}());
exports.MailComponent = MailComponent;
//# sourceMappingURL=Mail.js.map