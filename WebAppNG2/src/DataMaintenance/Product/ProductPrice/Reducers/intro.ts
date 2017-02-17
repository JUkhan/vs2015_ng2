import {Action} from '../../../../Shared/Store/Dispatcher';
import {PriceActions} from './PriceActions';


export const INTRO: string = '...';

export const intro = function (state = INTRO, action: Action) {
    console.log('intro', action);
    switch (action.type) {
        case PriceActions.INIT:
            return 'product price';       
        
        default: return state;
    }
}