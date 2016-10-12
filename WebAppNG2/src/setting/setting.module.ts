import { NgModule, ModuleWithProviders } from '@angular/core';

import {SharedModule}          from '../shared/shared.module';
import { CrudExample }         from './grid/crudExample';
import { TreeExample }         from './grid/treeExample';
import {CellEditExample}       from './grid/cellEditExample';
import {WindowComponent}       from './grid/windowExample';
import { routing }             from './setting.routes';


@NgModule({
    imports: [SharedModule, routing],
    declarations: [CrudExample, CellEditExample, TreeExample, WindowComponent],
    exports: []
})
export default class SettingModule { }
