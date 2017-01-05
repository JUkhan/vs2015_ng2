     
import {Component, OnInit, Input, ChangeDetectionStrategy}        from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Store} from '../store/Store';
import {ADD_HOUR, SUBTRACT_HOUR, ADD_INFO} from './houseWorked';

@Component({
    moduleId: module.id,
    selector: 'child', 
    template: `           
             <div>
                 name: {{person?.name}}  address: {{person?.address}}  count:{{person?.count}}
            </div> 
                   
            `, 
            changeDetection:ChangeDetectionStrategy.OnPush  
})
export class child  {
  
    @Input() person: any;
    constructor() {
      
        
    }
    
}