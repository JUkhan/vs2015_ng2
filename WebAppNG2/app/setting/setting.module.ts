import { NgModule, ModuleWithProviders } from '@angular/core';

import {SharedModule}          from '../shared/shared.module';
import { CrudExample }         from './grid/crudExample';
import { TreeExample }         from './grid/treeExample';
import {CellEditExample}       from './grid/cellEditExample';
import { routing }             from './setting.routes';


@NgModule({
    imports: [SharedModule, routing],
    declarations: [CrudExample, CellEditExample, TreeExample],
    exports: []
})
export default class SettingModule { }
