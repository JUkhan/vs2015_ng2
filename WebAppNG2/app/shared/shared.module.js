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
const common_1 = require('@angular/common');
const forms_1 = require('@angular/forms');
const router_1 = require('@angular/router');
const compiler_1 = require('@angular/compiler');
const juPanel_1 = require('./juPanel/juPanel');
const juPanelContent_1 = require('./juPanel/juPanelContent');
const juMenu_1 = require('./juMenu/juMenu');
const juPager_1 = require('./juPager/juPager');
const juForm_1 = require('./juForm/juForm');
const juSelect_1 = require('./juForm/juSelect');
const CkEditor_1 = require('./juForm/CkEditor');
const Datetimepicker_1 = require('./juForm/Datetimepicker');
const juGrid_1 = require('./juGrid/juGrid');
const rowEditor_1 = require('./juGrid/rowEditor');
const juWindowService_1 = require('./juWindow/juWindowService');
const Mail_1 = require('./app-ui/Mail');
const message_dialog_1 = require('./app-ui/message.dialog');
const confirm_dialog_1 = require('./app-ui/confirm.dialog');
const ui_service_1 = require('./ui.service');
const app_service_1 = require('./app.service');
const canDeactivateGuard_service_1 = require('./canDeactivateGuard.service');
const juForm_builder_1 = require('./juForm/juForm.builder');
const juGrid_builder_1 = require('./juGrid/juGrid.builder');
let SharedModule_1 = class SharedModule {
    static forRoot() {
        return {
            ngModule: SharedModule_1,
            providers: [app_service_1.AppService, ui_service_1.UiService, canDeactivateGuard_service_1.CanDeactivateGuard, juWindowService_1.juWindowService, juForm_builder_1.juFormBuilder, juGrid_builder_1.juGridBuilder]
        };
    }
};
let SharedModule = SharedModule_1;
SharedModule = SharedModule_1 = __decorate([
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
exports.SharedModule = SharedModule;
