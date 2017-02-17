
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter}          from '@angular/core';
import { juForm, FormElement, FormOptions }    from '../../shared/juForm/juForm';
import { juGrid, GridOptions}                   from '../../shared/juGrid/juGrid';
import { Attachment}                   from '../../shared/app-ui/attachment';

@Component({
    moduleId:module.id,
    selector:'related-products',
    template:`
         <div class="row">
            <div class="col-md-4">
                <div juForm (onLoad)="loadForm($event)" [options]="options"></div>
            </div>
            <div class="col-md-8">
                <div class="juGrid" [options]="gridOptions"></div>
            </div> 
        </div>       
       <data-switcher leftTitle="Available Products" rightTitle="Selected Products" [leftColumns]="leftColumns" [rightColumns]="rightColumns"></data-switcher>
    `
})
export class RelatedProducts implements OnInit, OnDestroy {
        
    public options: FormOptions;
    public leftColumns:any[];
    public rightColumns:any[];
    public form: juForm;
    public gridOptions:GridOptions;

    @Output() onLoad=new EventEmitter();
    constructor( ){        
        this.initForm();
        this.initDataSwitcherColumns();
    }   
    public ngOnInit() {
        this.initGrid();
    }
    public ngOnDestroy() {

    }
    protected initForm() {
        this.options = {
            viewMode: 'form', labelPos:'left',
            refreshBy:{category:'ndc'},           
            inputs: [
                {
                    type: 'groupLayout', items: [
                        {groupName: 'Criteria', size:12,  labelSize: 4,  inputs: [
                               [{field:'company', label:'Company', size:8, type:'juSelect', options:{width:'100%'}}, {type:'button', size:4, exp:'class="btn btn-primary"', label:'Find', click:this.find.bind(this)}]                               
                            ]
                        },
                        
                            {groupName: 'Search Available Products', size:12,    inputs: [
                               [{ exp:'value="ndc"', label:'By NDC', field:'category', size:4, labelPos:'right', type:'radio', radioName:'category', }, {type:'text', size:8, labelSize: 1, label:'', field:'categoryValue'}] ,
                               [{ exp:'value="!ndc"', label:'By Name',field:'category', size:4, labelPos:'right', type:'radio', radioName:'category'}]
                                ]
                            }
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
    protected initGrid(){
        this.gridOptions={
            viewMode:'panel', pagerPos:'header', title:'Uneveluated',
            columnDefs:[
                {headerName:'Name', field:'calc', width:220, filter:'text'},
                {headerName:'Status', field:'status', width:120},
                {headerName:'Time Period', field:'calc', width:120, filter:'text'},
                {headerName:'Start Date', field:'status', width:120},
                {headerName:'End Date', field:'calc', width:120},
                {headerName:'Processing Type', field:'status', width:150, filter:'set'},
                {headerName:'Prelim?', field:'calc', width:120},
                {headerName:'Modified Date', field:'status', width:120},
                {headerName:'Last Modified By', field:'calc', width:120},
                {headerName:'Profile Id', field:'status', width:120, filter:'number'},
                {headerName:'Attachments?', field:'calc', width:120}
                ]
        };
    }  
    protected initDataSwitcherColumns(){
            this.leftColumns=[
                {headerName:'NDC', field:'ndc'},
                {headerName:'Category', field:'category'},
                {headerName:'Product Famaly Name', field:'product', width:150}
            ];
            this.rightColumns=[
                {headerName:'BAMP', field:'bamp'},
                {headerName:'NDC', field:'ndc'},
                {headerName:'Category', field:'category'},
                {headerName:'Product Famaly Name', field:'product', width:150}
            ];
    }
}