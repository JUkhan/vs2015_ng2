
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';

import {storeFactory} from '../Store';
import {SharedModule} from '../shared/shared.module';
import {com} from './com';
import {child} from './child';
import {houseWorked, person} from './houseWorked';
import {routing} from './router'

@NgModule({
    imports: [CommonModule, FormsModule, SharedModule, routing],
    declarations: [
       com, child
    ],
    exports: [
       
    ],
    providers: [storeFactory({ houseWorked, person})]
})
export default class StoreExampleModule
{ 
   
}

