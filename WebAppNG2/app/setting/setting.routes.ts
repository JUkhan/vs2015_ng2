import { Routes,
    RouterModule }  from '@angular/router';

import { gridExample }         from './grid/grid';
import {UploadComponent}       from './upload/upload';
import {ClaimImport}       from './ClaimImport/ClaimImport.component';

const routes: Routes = [
    { path: '', component: gridExample },   
    { path: 'upload', component: UploadComponent },
    { path: 'claim', component: ClaimImport }
];

export const routing = RouterModule.forChild(routes);