
import {Injectable} from '@angular/core';
import {Actions} from '../../Shared/Store/Actions';
import {Effect} from '../../Shared/Store/Effects';
import {DECActions} from './DECActions';
import {Observable} from 'rxjs/Observable';
import {DisputeService} from '../DisputeService';

@Injectable()
export class DECEffects{
    constructor(private actions$:Actions, private decActions:DECActions, private service:DisputeService){

    }

    @Effect() init$=this.actions$
        .whenAction(DECActions.INIT)
        .switchMap(res=>Observable.of({type:DECActions.HELLO}));

    @Effect() rprLoad$=this.actions$
        .whenAction(DECActions.LOAD_RPR)
        .switchMap(_=>this.service.loadRPR())
        .map(res=>this.decActions.loadRprSuccess(res));

    @Effect() saveRpr$=this.actions$
        .whenAction(DECActions.SAVE_RPR)
        .switchMap(res=> this.service.saveRpr(res.payload))
        .map(res=>this.decActions.loadRpr());

    @Effect() hcfaLoad$=this.actions$
        .whenAction(DECActions.LOAD_HCFA)
        .switchMap(_=>this.service.loadHCFA())
        .map(res=>this.decActions.loadHcfaSuccess(res));

    @Effect() saveHcfa$=this.actions$
        .whenAction(DECActions.SAVE_HCFA)
        .switchMap(res=> this.service.saveHCFA(res.payload))
        .map(res=>this.decActions.loadHcfa());

    @Effect() removeRpr$=this.actions$
        .whenAction(DECActions.REMOVE_RPR)
        .switchMap(action=>{ 
            if(action.payload.newRecord) return Observable.of(action.payload);
            return this.service.removeRpr(action.payload);
        })
        .map(record=>this.decActions.removeRPRSuccess(record));

     @Effect() removeHcfa$=this.actions$
        .whenAction(DECActions.REMOVE_HCFA)
        .switchMap(action=>{ 
            if(action.payload.newRecord) return Observable.of(action.payload);
            return this.service.removeHcfa(action.payload);
        })
        .map(record=>this.decActions.removeHCFASuccess(record));
}