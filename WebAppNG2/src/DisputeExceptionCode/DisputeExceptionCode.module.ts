import { NgModule, ModuleWithProviders } from '@angular/core';
import { SharedModule }          from '../shared/shared.module';
import { routing }               from  './DisputeExceptionCode.router';
import { DisputeExceptionCode }         from './DisputeExceptionCode.component';
import {Dispatcher} from '../Shared/Store/Dispatcher';
import {Actions} from '../Shared/Store/Actions';
import {Store, _INITIAL_REDUCER, combineReducers} from '../Shared/Store/Store';
import {hello} from './Reducers/hello';
import {buttonDeactive} from './Reducers/buttonDeactive';
import {hcfa} from './Reducers/hcfa';
import {rpr} from './Reducers/rpr';
import {ddlData} from './Reducers/ddlData';
import {EffectsSubscription, effects} from '../Shared/Store/effects-subscription';
import {DECEffects} from './Reducers/DECEffects';
import {DECActions} from './Reducers/DECActions';
import {DisputeService} from './DisputeService';


@NgModule({
    imports: [SharedModule, routing],
    declarations: [
        DisputeExceptionCode,
    ],
    exports: [],
    providers: [
        DisputeService, Dispatcher, Actions,DECActions,
        { provide: _INITIAL_REDUCER, useValue: combineReducers({hello,buttonDeactive, rpr, hcfa, ddlData}) },
        { provide: Store, useClass: Store, deps: [_INITIAL_REDUCER, Dispatcher] },
        { provide: effects, useClass: DECEffects, multi: true },        
        { provide: EffectsSubscription, useClass: EffectsSubscription, deps: [Store, effects] },
    ]
})
export default class DisputeExceptionCodeModule {
    constructor(es:EffectsSubscription){

    }
}


