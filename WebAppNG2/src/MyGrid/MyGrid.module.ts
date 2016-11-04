
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';

import {MyGrid} from './MyGrid';
import {HeaderComponent} from './HeaderComponent';
import {RowsComponent} from './RowsComponent';
import {CellComponent} from './CellComponent';

@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [
        MyGrid, HeaderComponent, RowsComponent, CellComponent
    ],
    exports: [
        MyGrid
    ],
    providers: []
})
export class MyGridModule
{

    //static forRoot(): ModuleWithProviders
    //{
    //    return {
    //        ngModule: SharedModule,
    //        providers: [AppService, UiService, CanDeactivateGuard, juWindowService, juFormBuilder, juGridBuilder]
    //    };
    //}
}

