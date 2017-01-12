
import {Action} from '../../Shared/Store/Dispatcher';
import {DECActions} from './DECActions';
export const hello = function (state = {}, action: Action) {
    switch (action.type) {
        case DECActions.INIT:
         return Object.assign({}, state, {init:'init'});
        case DECActions.HELLO:
            return Object.assign({}, state, {hello:'hello'});
            default: return state;
    }
}