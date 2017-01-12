import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {minesweeper} from './minesweeper/minesweeper';
export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },  
    { path: 'minesweeper', component: minesweeper },    
    { path: 'setting', loadChildren: 'app/setting/setting.module' },
    { path: 'storeEx', loadChildren: 'app/storeExample/storeEx.module' },
    { path: 'storeEx2', loadChildren: 'app/DisputeExceptionCode/DisputeExceptionCode.module' },
   
];

export const routing = RouterModule.forRoot(routes);