import { Routes, RouterModule }  from '@angular/router';
import { DisputeExceptionCode }         from './DisputeExceptionCode.component';
import {CanDeactivateGuard} from '../shared/canDeactivateGuard.service'


const routes: Routes = [
    { path: '', component: DisputeExceptionCode },
    { path: 'disputeexceptioncode', canDeactivate: [CanDeactivateGuard], component: DisputeExceptionCode }


];

export const routing = RouterModule.forChild(routes);