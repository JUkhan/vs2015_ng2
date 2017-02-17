
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter}          from '@angular/core';
import { juForm, FormElement, FormOptions }    from '../../shared/juForm/juForm';
import { juGrid, GridOptions}                   from '../../shared/juGrid/juGrid';
import { Attachment}                   from '../../shared/app-ui/attachment';
import { AppService}                   from '../../shared/app.service';

import {DataLoad} from './DataLoad';
import {DataSwitcher} from './DataSwitcher';
import {SetupProfileService} from '../SetupProfileService';
import {Store} from '../../Store';
@Component({
    moduleId:module.id,
    selector:'products',
    template:`
       <div juForm (onLoad)="loadForm($event)" [options]="options"></div>
       <data-switcher 
            (onLoad)="loadDataSwitcher($event)"
            (onMove)="onMove($event)"
            (onRemove)="onRemove($event)"
            leftTitle="Available Products" 
            rightTitle="Selected Products" 
            [leftColumns]="leftColumns" 
            [rightColumns]="rightColumns">
        </data-switcher>
    `
})
export class Products implements OnInit, OnDestroy, DataLoad {
        
    public options: FormOptions;
    public leftColumns:any[];
    public rightColumns:any[];
    model:any;

    public form: juForm;
    dataLoaded:boolean=false;
    @Output() onLoad=new EventEmitter();
    protected dataSwitcher:DataSwitcher;
    productDispose:any;
    constructor(private service:SetupProfileService, private store:Store ){        
        this.initForm();
        this.initDataSwitcherColumns();
    }   
    public ngOnInit() {
        
    }
    public ngOnDestroy() {
        this.productDispose && this.productDispose.unsubscribe();
    }
    protected initForm() {
        this.options = {
            viewMode: 'form', labelPos:'left',
            refreshBy:{category:'ndc'},           
            inputs: [
                {
                    type: 'groupLayout', items: [
                        [{groupName: 'Criteria', size:4,  labelSize: 4,  inputs: [
                               [{field:'company', label:'Company', size:8, type:'juSelect', options:{width:'100%'}}, {type:'button', size:2, exp:'class="btn btn-primary"', label:'Find', click:this.find.bind(this)}]                               
                            ]
                        },
                        
                            {groupName: 'Search Available Products', size:6,    inputs: [
                               [{ exp:'value="ndc"', label:'By NDC', field:'category', size:4, labelPos:'right', type:'radio', radioName:'category1', }, {type:'text', size:6, labelSize:1, label:'', field:'categoryValue'}] ,
                               [{ exp:'value="!ndc"', label:'By Name',field:'category', size:4, labelPos:'right', type:'radio', radioName:'category1'}]
                                ]
                            }]
                   ]
                }
            ]
        };
    }
    protected loadForm(form: juForm) {
        this.form = form; 
        this.onLoad.emit(this);  
            
    }    
   
    protected find(){
      console.log(this.form.getModel());
    }
    protected initDataSwitcherColumns(){
            this.leftColumns=[
                {headerName:'NDC', field:'ndc'},
                {headerName:'Category', field:'category'},
                {headerName:'Product Famaly Name', field:'product', width:250}
            ];
            this.rightColumns=[
                {headerName:'BAMP', field:'bamp'},
                {headerName:'NDC', field:'ndc'},
                {headerName:'Category', field:'category'},
                {headerName:'Product Famaly Name', field:'product', width:150}
            ];
    }
    protected loadDataSwitcher(ds:DataSwitcher){
        this.dataSwitcher=ds;
    }
    public onDemand(){        
        if(this.dataLoaded)return;
        //this.service.messageDialog('hello', 'world');
        this.loadLeftGridData();
        this.productDispose= this.store.select('product').subscribe(model=>{
                console.log('model: ', model);
                this.model=model;                 
                this.setData();              
        });      
        if(!this.model.products) this.service.getProducts();
        this.dataLoaded=true;
    }
    setData(){
        this.form.setData('company', this.model.products);
    }
    protected loadLeftGridData(){
        this.dataSwitcher.leftData=[
            {ndc:'ndc1', category:'cat11', product:'product-1', bamp:'bamp-1'},
            {ndc:'ndc2', category:'cat12', product:'product-2', bamp:'bamp-2'},
            {ndc:'ndc3', category:'cat12', product:'product-3', bamp:'bamp-3'}
            ]
    }
    protected onMove(data){
        console.log(data);
    }

    protected onRemove(data){
        console.log(data);
    }
}