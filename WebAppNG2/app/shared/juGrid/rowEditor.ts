import {Directive, OnInit, ContentChildren, QueryList, ElementRef, OnDestroy} from '@angular/core';
import {juSelect}                 from '../juForm/juSelect';
import {Datetimepicker}                 from '../juForm/Datetimepicker';
import {Observable, Subscription} from 'rxjs/Rx';
@Directive({
    selector: '.row-editor',
    inputs: ['model','config'],
    outputs:['rowUpdate']
})
export class rowEditor implements OnInit {  
    model: any;
    config:any;
    isUpdated: boolean = false;    
    private subsList: Subscription[] = [];
    constructor(private el: ElementRef) {

    }
    @ContentChildren(juSelect) juSelectList: QueryList<juSelect>;
    @ContentChildren(Datetimepicker) datepickerList: QueryList<Datetimepicker>;

    ngAfterContentInit() {
        this.eventBinding(this.el.nativeElement.querySelectorAll('.select'), 'change');
        this.eventBinding(this.el.nativeElement.querySelectorAll('.text'), 'change');
        this.juSelectList.toArray().forEach(_=>{
           this.subsList.push(_.notifyRowEditor.subscribe(()=>{this.isUpdated=true}));
        });
        this.datepickerList.toArray().forEach(_ => {
            this.subsList.push(_.notifyRowEditor.subscribe(() => { this.isUpdated = true }));
        });
    }

    ngOnInit() {

    }
    ngOnDestroy() {        
        this.subsList.forEach(_ => {
            if (!_.isUnsubscribed) {
                _.unsubscribe();
                _.remove(_);
            }
        })
    }
    isValid(fieldName:string){         
        let def=this.config.columnDefs.find(_=>_.field===fieldName), res=true;
        if(def){
            res=this.validate_input(this.model[fieldName], fieldName, def);
        }                        
        return {'validation-msg-show':!res, 'validation-msg-hide':res};
    } 
    getValidationMsg(fieldName:string) {
        return this.validationMsg[fieldName];
    } 
    setJuSelectData(key: string, value: any[]){
       try{
          this.juSelectList.toArray().find(_=>_.propertyName===key).dataSrc=value;
       }catch(er){
           console.error(`Did not find the field name '${key}'`);           
       }
    } 
    private eventBinding(list: any[], eventName: string) {
        for (var i = 0; i < list.length; i++) {
            this.subsList.push(Observable.fromEvent(list[i], eventName).subscribe(e => {
                this.isUpdated = true;
            }));
        }
    }
    private validationMsg:any={};
    private validate_input(val: any, field: any, def:any) {       
            let res = true;
            if (def.validators) {
                if (Array.isArray(def.validators) && def.validators.length > 0) {
                    let len = def.validators.length, i = 0;
                    while (i < len && (res=this.validate_input_helper(val, field, def.validators[i]))) {
                        i++;
                    }
                }
                else if (typeof def.validators === 'function') {                    
                    res=this.validate_input_helper(val, field, def.validators);
                }
            }
            return res;
        }
       private validate_input_helper(val: any, field: any, fx: Function) {           
            let msg = fx(val, field);            
            if (typeof msg === 'string') {               
                this.validationMsg[field] = msg;                
                return false;
            }
            return true;
            
        }
}