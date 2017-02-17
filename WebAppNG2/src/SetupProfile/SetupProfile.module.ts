import { NgModule, ModuleWithProviders } from '@angular/core';
import {SharedModule}          from '../shared/shared.module';
import { SetupProfile }         from './SetupProfile';

import { routing }             from './SetupProfile.router';

import {storeFactory} from '../Store';
import {product} from './reducers/product';

import {SetupProfileService} from './SetupProfileService';

@NgModule({
    imports: [SharedModule, routing],
    declarations: [SetupProfile],
    exports: [],
    providers: [SetupProfileService, storeFactory({product})]
})
export default class SetupProfileModule {

    
}
