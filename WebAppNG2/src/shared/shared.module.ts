import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';
import { RouterModule }         from '@angular/router';
import { COMPILER_PROVIDERS } from '@angular/compiler';

import {juPanel}                from './juPanel/juPanel';
import {juPanelContent}         from './juPanel/juPanelContent';
import {juMenu}                 from './juMenu/juMenu';
import {juPager}                from './juPager/juPager';
import {juForm}                 from './juForm/juForm';
import {juSelect}               from './juForm/juSelect';
import {CkEditor, FileSelect}   from './juForm/CkEditor';
import {Datetimepicker}         from './juForm/Datetimepicker';
import {juGrid}                 from './juGrid/juGrid';
import {rowEditor}              from './juGrid/rowEditor';
import {juParentWindow}         from './juWindow/juParentWindow';
import {juChildWindow}          from './juWindow/juChildWindow';
import {juWindowService}        from './juWindow/juWindowService';
import {MailComponent}          from './app-ui/Mail';
import {MessageDialog}          from './app-ui/message.dialog';
import {ConfirmDialog}          from './app-ui/confirm.dialog';
import {ReportViewer}          from './app-ui/report.viewer';

import {UiService}              from './ui.service';
import {AppService}             from './app.service';
import {CanDeactivateGuard} from './canDeactivateGuard.service';
import {juFormBuilder} from './juForm/juForm.builder';
import {juGridBuilder} from './juGrid/juGrid.builder';

@NgModule({
    imports: [CommonModule, RouterModule, FormsModule],
    declarations: [
        juPanel,
        juPanelContent,
        juMenu,
        juPager,
        juForm,
        juSelect, 
        CkEditor,
        FileSelect,
        Datetimepicker,
        juGrid,
        rowEditor,
        MailComponent, MessageDialog, ConfirmDialog, ReportViewer
    ],
    exports: [
        CommonModule,
        FormsModule,
        juPanel,
        juPanelContent,
        juMenu,
        juPager,
        juForm,
        juSelect,
        CkEditor,
        FileSelect,
        Datetimepicker,
        juGrid,
        rowEditor,
        MailComponent, MessageDialog, ConfirmDialog, ReportViewer
    ],
    providers: [COMPILER_PROVIDERS]
})
export class SharedModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [AppService, UiService, CanDeactivateGuard, juWindowService, juFormBuilder, juGridBuilder]
        };
    }
}


//@NgModule({
//  exports:   [ SharedModule ],
//  providers: [ UserService ]
//})
//export class SharedRootModule { }

