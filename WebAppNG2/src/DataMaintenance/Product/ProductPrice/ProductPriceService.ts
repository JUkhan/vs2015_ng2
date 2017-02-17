import {Injectable} from '@angular/core';
import {AppService} from '../../../shared/app.service';
import { Observable} from 'rxjs/Rx';

@Injectable()
export class ProductPriceService {
    constructor(public service: AppService) { }
    loadFiendLabeler()
    {
        console.log('loadFiendLabeler');
        return Observable.of([{ text: 'text1', value: 1 }])
    }
    loadSearchLabeler()
    {
        console.log('loadSearchLabeler');
        return Observable.of([{ text: 'text2', value: 1 }])
    }
    loadPrice()
    {
        return Observable.of([{ text: 'price1', value: 1 }, { text: 'price2', value: 3 }])
    }
   
    find(params: any)
    {
        return Observable.of([
            {
                PROD_PRICE_TYP_CD: 1,
                NDC_LBL: '00034',
                NDC_PROD: '012',
                NDC_PCKG: '01',
                EFF_DT: '12/12/2016',
                END_DT: '12/12/2016',
                PRICE_AMT: 23,
                PROD_NM: 'product-1'
            }
        ]);
    }
}