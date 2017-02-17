import {Injectable} from '@angular/core';
import {AppService} from '../../../Shared/app.service';
import { Observable} from 'rxjs/Rx';

@Injectable()
export class ProductPriceService__{
    constructor(public service: AppService) {

    }

    loadFiendLabeler(){
        return Observable.of([{text:'text1', value:1}])
    }
    loadSearchLabeler(){
        return Observable.of([{text:'text2', value:1}])
    }

    find(params:any){
        return Observable.of([
            {PROD_PRICE_TYP_CD:1, 
            NDC_LBL:'00034', 
            NDC_PROD:'012', 
            NDC_PCKG:'01', 
            EFF_DT:'12/12/2016', 
            END_DT:'12/12/2016', 
            PRICE_AMT:23, 
            PROD_NM:'product-1'}
        ]);
    }
}

