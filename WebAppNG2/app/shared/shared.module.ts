import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';
import { RouterModule }         from '@angular/router';

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

import {UiService}              from './ui.service';
import {AppService}             from './app.service';

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
        juParentWindow,
        juChildWindow
       
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
        juParentWindow,
        juChildWindow
       
    ],
    providers: [juWindowService]
})
export class SharedModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [AppService, UiService]
        };
    }
}


//@NgModule({
//  exports:   [ SharedModule ],
//  providers: [ UserService ]
//})
//export class SharedRootModule { }

