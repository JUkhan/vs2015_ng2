
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';

import {MyGrid} from './MyGrid';
import {Header} from './Header';
import {Row} from './Row';
import {Cell, SafeHtmlPipe} from './Cell';
import {Renderer} from './Renderer';
import {SharedModule} from '../shared/shared.module';

@NgModule({
    imports: [CommonModule, FormsModule, SharedModule],
    declarations: [
        MyGrid, Header, Row, Cell, Renderer, SafeHtmlPipe
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

