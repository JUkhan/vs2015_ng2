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
var common_1 = require('@angular/common');
var forms_1 = require('@angular/forms');
var router_1 = require('@angular/router');
var compiler_1 = require('@angular/compiler');
var juPanel_1 = require('./juPanel/juPanel');
var juPanelContent_1 = require('./juPanel/juPanelContent');
var juMenu_1 = require('./juMenu/juMenu');
var juPager_1 = require('./juPager/juPager');
var juForm_1 = require('./juForm/juForm');
var juSelect_1 = require('./juForm/juSelect');
var CkEditor_1 = require('./juForm/CkEditor');
var Datetimepicker_1 = require('./juForm/Datetimepicker');
var juGrid_1 = require('./juGrid/juGrid');
var rowEditor_1 = require('./juGrid/rowEditor');
var juWindowService_1 = require('./juWindow/juWindowService');
var Mail_1 = require('./app-ui/Mail');
var message_dialog_1 = require('./app-ui/message.dialog');
var confirm_dialog_1 = require('./app-ui/confirm.dialog');
var ui_service_1 = require('./ui.service');
var app_service_1 = require('./app.service');
var canDeactivateGuard_service_1 = require('./canDeactivateGuard.service');
var juForm_builder_1 = require('./juForm/juForm.builder');
var juGrid_builder_1 = require('./juGrid/juGrid.builder');
var SharedModule = (function () {
    function SharedModule() {
    }
    SharedModule.forRoot = function () {
        return {
            ngModule: SharedModule,
            providers: [app_service_1.AppService, ui_service_1.UiService, canDeactivateGuard_service_1.CanDeactivateGuard, juWindowService_1.juWindowService, juForm_builder_1.juFormBuilder, juGrid_builder_1.juGridBuilder]
        };
    };
    SharedModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, router_1.RouterModule, forms_1.FormsModule],
            declarations: [
                juPanel_1.juPanel,
                juPanelContent_1.juPanelContent,
                juMenu_1.juMenu,
                juPager_1.juPager,
                juForm_1.juForm,
                juSelect_1.juSelect,
                CkEditor_1.CkEditor,
                CkEditor_1.FileSelect,
                Datetimepicker_1.Datetimepicker,
                juGrid_1.juGrid,
                rowEditor_1.rowEditor,
                Mail_1.MailComponent, message_dialog_1.MessageDialog, confirm_dialog_1.ConfirmDialog
            ],
            exports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                juPanel_1.juPanel,
                juPanelContent_1.juPanelContent,
                juMenu_1.juMenu,
                juPager_1.juPager,
                juForm_1.juForm,
                juSelect_1.juSelect,
                CkEditor_1.CkEditor,
                CkEditor_1.FileSelect,
                Datetimepicker_1.Datetimepicker,
                juGrid_1.juGrid,
                rowEditor_1.rowEditor,
                Mail_1.MailComponent, message_dialog_1.MessageDialog, confirm_dialog_1.ConfirmDialog
            ],
            providers: [compiler_1.COMPILER_PROVIDERS]
        }), 
        __metadata('design:paramtypes', [])
    ], SharedModule);
    return SharedModule;
}());
exports.SharedModule = SharedModule;
//# sourceMappingURL=shared.module.js.map