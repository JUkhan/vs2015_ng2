import { Routes,
    RouterModule }  from '@angular/router';

import { gridExample }         from './grid/grid';
import {UploadComponent}       from './upload/upload';


const routes: Routes = [
    { path: '', component: gridExample },   
    { path: 'upload', component: UploadComponent }
   
];

export const routing = RouterModule.forChild(routes);