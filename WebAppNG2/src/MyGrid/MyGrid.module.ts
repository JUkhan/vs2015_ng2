
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';

import {MyGrid} from './MyGrid';
import {Header} from './Header';
import {Row} from './Row';
import {Cell, SafeHtmlPipe} from './Cell';
import {Renderer} from './Renderer';
import {SharedModule} from '../shared/shared.module';
import {GridBuilder} from './Grid.builder';

@NgModule({
    imports: [CommonModule, FormsModule, SharedModule],
    declarations: [
        MyGrid, Header, Row, Cell, Renderer, SafeHtmlPipe
    ],
    exports: [
        MyGrid, Header
    ],
    providers: [GridBuilder]
})
export class MyGridModule
{ 
   
}

