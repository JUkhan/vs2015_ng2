import { Routes, RouterModule }  from '@angular/router';
import { ProductPrice }         from './ProductPrice.component';
import {CanDeactivateGuard} from '../../../shared/canDeactivateGuard.service'


const routes: Routes = [
    { path: '', component: ProductPrice },
    { path: 'productprice', canDeactivate: [CanDeactivateGuard], component: ProductPrice }


];

export const routing = RouterModule.forChild(routes);