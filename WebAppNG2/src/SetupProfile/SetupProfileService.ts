
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Store} from '../Store';
import {GET_PTODUCTS} from './reducers/product';

@Injectable()
export class SetupProfileService{
           constructor(private store:Store){ }
           getProducts(){
                const arr=[{text:'Pro-1', value:1},{text:'Pro-2', value:2},{text:'Pro-3', value:3}];
                this.store.dispatch({type:GET_PTODUCTS, payload:arr});
           }
}