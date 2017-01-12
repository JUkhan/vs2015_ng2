
import {Action} from '../../Shared/Store/Dispatcher';
import {DECActions} from './DECActions';

export const BUTTON_DEACTIVE_INIT:any={ok:true, add:false, delete:true};

export const buttonDeactive = function (state = BUTTON_DEACTIVE_INIT, action: Action) {
    switch (action.type) {
        case DECActions.BUTTON_DEACTIVE:
            return Object.assign({}, state, action.payload);        
        default: return state;
    }
}