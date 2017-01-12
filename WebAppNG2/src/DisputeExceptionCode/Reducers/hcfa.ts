

import {Action} from '../../Shared/Store/Dispatcher';
import {DECActions} from './DECActions';

export const HCFA_INIT:any[]=[];

export const hcfa = function (state = HCFA_INIT, action: Action) {
    switch (action.type) {
         case DECActions.LOAD_HCFA:
            return state;   
        case DECActions.LOAD_HCFA_SUCCESS:
           return action.payload; 
        case DECActions.ADD_HCFA:
             return [
                ...state.slice(0, action.payload+1),
                 {HCFA_DSPT_RSN_CD:'', HCFA_DSPT_RSN_TYP_CD:'',  HCFA_DSPT_RSN_DESCR:'des...', newRecord:true},
                ...state.slice(action.payload+1)
                ]; 
        case DECActions.REMOVE_HCFA_SUCCESS:
            return state.filter(_=>_!==action.payload);   
        default: return state;
    }
}