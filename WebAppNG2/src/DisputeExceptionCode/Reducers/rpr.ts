
import {Action} from '../../Shared/Store/Dispatcher';
import {DECActions} from './DECActions';
import {tabModel} from './model';

export const RPT_INIT:any[]=[];//{initDataList:[], currentDataList:[], selectedItem:null, updatePending:false};

export const rpr = function (state = RPT_INIT, action: Action) {
    switch (action.type) {
        case DECActions.LOAD_RPR:
            return state;   
        case DECActions.LOAD_RPR_SUCCESS:
            return action.payload;
        case DECActions.ADD_RPR:
            return [
                ...state.slice(0, action.payload+1),
                {RPR_DSPT_RSN_SHRT_DESCR:'', RPR_DSPT_RSN_DESCR:'', HCFA_DSPT_RSN_CD:'', ACTV_FLG:true, newRecord:true},
                ...state.slice(action.payload+1)
                ];
           
        case DECActions.REMOVE_RPR_SUCCESS:           
            return state.filter(_=>_!==action.payload);
       
        default: return state;
    }
}