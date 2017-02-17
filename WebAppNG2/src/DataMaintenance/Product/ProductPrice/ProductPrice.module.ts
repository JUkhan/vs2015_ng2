import { NgModule, ModuleWithProviders } from '@angular/core';
import { SharedModule }          from '../../../shared/shared.module';
import { routing }               from  './ProductPrice.router';
import { ProductPrice }         from './ProductPrice.component';
import {Dispatcher} from '../../../Shared/Store/Dispatcher';
import {Actions} from '../../../Shared/Store/Actions';
import {Store, _INITIAL_REDUCER, combineReducers} from '../../../Shared/Store/Store';
import {EffectsSubscription, effects} from '../../../Shared/Store/effects-subscription';
import {PriceActions} from './Reducers/PriceActions';
import {PriceEffects} from './Reducers/PriceEffects';
import {ProductPriceService} from './ProductPriceService';
import {intro} from './Reducers/intro';

@NgModule({
    imports: [SharedModule, routing],
    declarations: [
        ProductPrice,
    ],
    exports: [],
    providers: [
        ProductPriceService, Dispatcher, Actions, PriceActions,
        { provide: _INITIAL_REDUCER, useValue: combineReducers({ intro }) },
        { provide: Store, useClass: Store, deps: [_INITIAL_REDUCER, Dispatcher] },
        { provide: effects, useClass: PriceEffects, multi: true },
        { provide: EffectsSubscription, useClass: EffectsSubscription, deps: [Store, effects] },
    ]
})
export default class ProductPriceModule {

}


