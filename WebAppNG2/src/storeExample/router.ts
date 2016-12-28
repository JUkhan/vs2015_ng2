import { Routes, RouterModule } from '@angular/router';
import {com} from './com';

export const routes: Routes = [
    { path: '', component:com }
  
];
export const routing = RouterModule.forChild(routes);

