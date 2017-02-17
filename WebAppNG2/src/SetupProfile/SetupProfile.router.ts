import { Routes, RouterModule }  from '@angular/router';

import { SetupProfile }         from './SetupProfile';
import {CanDeactivateGuard} from '../shared/canDeactivateGuard.service'


const routes: Routes = [  
    { path: '', component: SetupProfile, data:{status:'born at today'} }, 
    { path: 'setupProfile', canDeactivate: [CanDeactivateGuard], component: SetupProfile }
  

];

export const routing = RouterModule.forChild(routes);