import { Routes,
    RouterModule }  from '@angular/router';

import { CrudExample }         from './grid/crudExample';
import { TreeExample }         from './grid/treeExample';
import {CellEditExample}       from './grid/cellEditExample';
import {WindowComponent}       from './grid/windowExample';
import {Project1}              from './project1/project1';
const routes: Routes = [
    { path: '', component: CrudExample },   
    { path: 'cellEdit', component: CellEditExample },
    { path: 'treeView', component: TreeExample },
    { path: 'window', component: WindowComponent },
    { path: 'project1', component: Project1 },
];

export const routing = RouterModule.forChild(routes);