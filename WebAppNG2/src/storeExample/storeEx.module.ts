
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';

import { Actions} from '../store/actions';
import { _INITIAL_REDUCER, combineReducers, Store} from '../store/Store';
import {EffectsModule} from '../store/effects.module';
import {SharedModule} from '../shared/shared.module';
import {com} from './com';
import {child} from './child';
import {houseWorked, person} from './houseWorked';
import {routing} from './router'
import {HelloEffects} from './helloEffects';
import {Dispatcher} from '../store/Dispatcher';
import {EffectsSubscription, effects} from '../store/effects-subscription';
 //Dispatcher, ...storeFactory({ houseWorked, person }), ...EffectsModule.run(HelloEffects)

@NgModule({
    imports: [CommonModule, FormsModule, SharedModule, routing
        //StoreModule.provideStore({ houseWorked, person })
        //EffectsModule.run(HelloEffects)
    ],
    declarations: [
       com, child
    ],
    exports: [
       
    ],
    providers: [
        Dispatcher, Actions,
        { provide: _INITIAL_REDUCER, useValue: combineReducers({ houseWorked, person }) },
        { provide: Store, useClass: Store, deps: [_INITIAL_REDUCER, Dispatcher] },
        { provide: effects, useClass: HelloEffects, multi: true },        
        { provide: EffectsSubscription, useClass: EffectsSubscription, deps: [Store, effects] },
    ]
})
export default class StoreExampleModule
{ 
   
}

