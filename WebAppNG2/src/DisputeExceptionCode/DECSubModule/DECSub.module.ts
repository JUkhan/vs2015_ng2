
import { NgModule, ModuleWithProviders } from '@angular/core';
import {SharedModule}          from '../../shared/shared.module';

import {HCFA} from './HCFA';
import { RPR } from './RPR';


const COM_LIST=[
    HCFA, RPR
    ];

@NgModule({
    imports: [SharedModule],
    declarations: COM_LIST,
    exports: COM_LIST,
    providers: []
})
export  class DECSubModule {

    
}
