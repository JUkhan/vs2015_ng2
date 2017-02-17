
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter}          from '@angular/core';
import { juForm, FormElement, FormOptions }    from '../../shared/juForm/juForm';
import { juGrid, GridOptions}                   from '../../shared/juGrid/juGrid';
import { Attachment}                   from '../../shared/app-ui/attachment';

@Component({
    moduleId:module.id,
    selector:'exclusion',
    template:`
    <div class="row">
        <div class="col-md-4">
            <filter></filter>
        </div>        
    </div>
     <div class="juGrid" [options]="gridOptions"></div>
    `
})
export class Exclusion implements OnInit, OnDestroy {
        
   public gridOptions:GridOptions;
    public leftColumns:any[];
    public rightColumns:any[];
    public form: juForm;
    
    @Output() onLoad=new EventEmitter();
    constructor( ){        
       this.initGrid();
        
    }   
    public ngOnInit() {
        
    }
    public ngOnDestroy() {

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
    
}