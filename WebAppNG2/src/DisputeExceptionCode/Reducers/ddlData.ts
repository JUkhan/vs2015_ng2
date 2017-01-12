
import {Action} from '../../Shared/Store/Dispatcher';
import {DECActions} from './DECActions';

export const DDL_DATA_INIT:any={data1:[], data2:[]};

export const ddlData = function (state = DDL_DATA_INIT, action: Action) {
    switch (action.type) {
              
        default: return state;
    }
}