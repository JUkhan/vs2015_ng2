import { NgModule, ModuleWithProviders } from '@angular/core';

import {SharedModule}          from '../shared/shared.module';
import { gridExample }         from './grid/grid';
import {UploadComponent}       from './upload/upload';
import {ClaimImport}           from './ClaimImport/ClaimImport.component';
import { routing }             from './setting.routes';


@NgModule({
    imports: [SharedModule, routing],
    declarations: [gridExample, UploadComponent, ClaimImport],
    exports: []
})
export default class SettingModule { }
