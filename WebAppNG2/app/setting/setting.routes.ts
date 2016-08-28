import { Routes,
    RouterModule }  from '@angular/router';

import { gridExample }         from './grid/grid';
import {UploadComponent}       from './upload/upload';
import {WindowComponent}       from './window/window.component';

const routes: Routes = [
    { path: '', component: gridExample },   
    { path: 'upload', component: UploadComponent },
    { path: 'window', component: WindowComponent }
];

export const routing = RouterModule.forChild(routes);