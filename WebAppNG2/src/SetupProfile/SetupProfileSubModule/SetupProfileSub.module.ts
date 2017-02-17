
import { NgModule, ModuleWithProviders } from '@angular/core';
import {SharedModule}          from '../../shared/shared.module';
import { ProfileDetails }         from './ProfileDetails';
import {Filter} from './Filter'
import {DataSwitcher} from './DataSwitcher';
import {Products} from './Products';
import {Trade} from './Trade';
import {COT} from './COT';
import {Estimation} from './Estimation';
import {Matrix} from './Matrix';
import {RelatedProducts} from './RelatedProducts';
import {Transaction} from './Transaction';
import {Variables} from './Variables';
import {Exclusion} from './Exclusion';

const COM_LIST=[
    ProfileDetails, Filter, DataSwitcher, Products,Trade, COT, Estimation, Matrix, RelatedProducts, Transaction, Exclusion, Variables
    ];

@NgModule({
    imports: [SharedModule],
    declarations: COM_LIST,
    exports: COM_LIST,
    providers: []
})
export  class SetupProfileSubModule {

    
}
