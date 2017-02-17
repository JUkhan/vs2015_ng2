import {Injectable} from '@angular/core';
import {Actions} from '../../../../Shared/Store/Actions';
import {Effect} from '../../../../Shared/Store/Effects';
import {PriceActions} from './PriceActions';
import {Observable} from 'rxjs/Observable';
import {ProductPriceService} from '../ProductPriceService';

@Injectable()
export class PriceEffects {
    constructor(private actions$: Actions, private priceActions: PriceActions, private service: ProductPriceService) {

    }

    @Effect() intro$ = this.actions$
        .whenAction('INIT_STORE')
        .map(it=>this.priceActions.init());
}