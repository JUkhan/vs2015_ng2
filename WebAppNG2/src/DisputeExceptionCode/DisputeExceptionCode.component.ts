import { Component , OnDestroy} from '@angular/core';
import { juForm, FormElement, FormOptions } from '../shared/juForm/juForm';
import {DECSubModule} from './DECSubModule/DECSub.module';
import {Store} from '../Shared/Store/Store';
import {DECActions} from './Reducers/DECActions';
import {Observable, Subscription} from 'rxjs/Rx';
import {tabModel} from './Reducers/model';
import {RPR} from './DECSubModule/RPR';
import {HCFA} from './DECSubModule/HCFA';
import {DisputeService} from './DisputeService';
@Component({
    moduleId: module.id,
    selector: 'dispute-exception-code-tab',   
    templateUrl: './DisputeExceptionCode.html',
    //styleUrls: ['./DisputeExceptionCode.css']
})
export class DisputeExceptionCode implements OnDestroy {
   
    subs:Subscription[]=[];
    options: FormOptions = {};
    form: juForm; 
    currentTab:string='RPR Dispute Codes'; 
    rprCom:RPR;
    hcfaCom:HCFA;
    title:string='Dispute Code - Maintenance';
    constructor(private store:Store, private actions:DECActions, private service:DisputeService) {        
        this.initForm();
        this.setButtonStatus();
        this.loadData();
        this.store.dispatch(this.actions.loadRpr());
         this.store.dispatch(this.actions.loadHcfa());
    }
    loadData(){
      this.subs.push(this.store.select('rpr').subscribe(data=>{          
          this.options['dataObj'].rpr=data;          
        }));
      this.subs.push(this.store.select('hcfa').subscribe((data)=>{          
          this.options['dataObj'].hcfa=data;          
        }));
    }
    setButtonStatus(){
        this.subs.push(this.store.select('buttonDeactive').subscribe(res=>{
            this.options['buttonDeactive'] = res; console.log(res);
        }));
    }
    ngOnDestroy(){
        this.subs.forEach(_=>_.unsubscribe());
    }
    protected initForm() {
        this.options = {
            dataObj:{rpr:[], hcfa:[]},
            buttonDeactive:{},
            viewMode: 'form', modules: [DECSubModule], tabClick: this.tabClick.bind(this),
            tabs: {
                'RPR Dispute Codes': [{ type: 'html', content: '<rpr [rprList]="config.dataObj.rpr" (onLoad)="config.loadRpr($event)"></rpr>' }],
                'HCFA Dispute Codes': [{ type: 'html', content: '<hcfa [hcfaList]="config.dataObj.hcfa" (onLoad)="config.loadHcfa($event)"></hcfa>' }]

            },

            buttons: { 
                Save: { type: 'button', exp:`[disabled]="config.buttonDeactive.ok"`, cssClass: 'btn btn-primary',  click:this.save.bind(this) },
                Add: { type: 'button', exp:`[disabled]="config.buttonDeactive.add"`, cssClass: 'btn btn-primary',  click:this.add.bind(this)} ,
                Delete: { type: 'button', exp:`[disabled]="config.buttonDeactive.delete"`, cssClass: 'btn btn-primary',  click:this.remove.bind(this) } ,
                'Save As...': { type: 'button', cssClass: 'btn btn-primary',  click: () => {  } } 
            },
            loadRpr:(com:RPR)=>{
                this.rprCom=com;
            },
            loadHcfa:(com:HCFA)=>{
                this.hcfaCom=com;
            }
        }; 
    }
    protected loadForm(form: juForm) {
        this.form = form;

    }
    protected tabClick(tabName) {       
        if(this.isUpdatePending()){            
             this.save();
        }
        this.currentTab = tabName;
        this.setButtonDeactive();
    }
    protected setButtonDeactive() {
        this.store.dispatch(this.actions.buttonDeactive({ delete: this.currentTab === 'HCFA Dispute Codes'  }));
    } 
    protected isUpdatePending(){
        if(this.currentTab==='RPR Dispute Codes'){
            if(this.rprCom && this.rprCom.isUpdatePending()) return true;
        }else{
            if(this.hcfaCom && this.hcfaCom.isUpdatePending()) return true;
        }
        return false;
    }
    protected add(){
        this.currentTab==='RPR Dispute Codes'? this.rprCom.addRow():this.hcfaCom.addRow()
    }
    protected save(){console.log('save....');
        this.currentTab==='RPR Dispute Codes'?this.rprCom.save():this.hcfaCom.save()
    }
    protected remove(){
        this.currentTab==='RPR Dispute Codes'?this.rprCom.remove():this.hcfaCom.remove()
    }
}