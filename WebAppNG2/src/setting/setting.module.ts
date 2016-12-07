import { NgModule, ModuleWithProviders } from '@angular/core';

import {SharedModule}          from '../shared/shared.module';
import { CrudExample }         from './grid/crudExample';
import { TreeExample }         from './grid/treeExample';
import {CellEditExample}       from './grid/cellEditExample';
import {WindowComponent}       from './grid/windowExample';
import {Project1}              from './project1/project1';
import {Word}              from './project1/word';
import { routing }             from './setting.routes';


@NgModule({
    imports: [SharedModule, routing],
    declarations: [CrudExample, CellEditExample, TreeExample, WindowComponent, Project1, Word],
    exports: []
})
export default class SettingModule { }
