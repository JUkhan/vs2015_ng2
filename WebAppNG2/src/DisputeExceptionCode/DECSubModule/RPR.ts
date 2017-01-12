import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, forwardRef, Inject, ViewEncapsulation } from '@angular/core';
import { juGrid, GridOptions}                   from '../../shared/juGrid/juGrid';

import {Observable} from 'rxjs/Rx';

import {Store} from '../../Shared/Store/Store';
import {DECActions} from '../Reducers/DECActions';

@Component({
    moduleId: module.id, encapsulation:ViewEncapsulation.None,
    selector: 'rpr',
    template: `
    
     <div  class="juGrid" [options]="gridOptions" [data]="dataList" (onLoad)="gridOnLoad($event)"></div>
     <div><b>Total Aventis Dispute Codes: {{dataList.length}}</b></div>
    `,
    styles:[`.tbl-body-content{min-height:500px;}`]
}) 
export class RPR implements OnInit, OnDestroy {

     constructor(private store:Store, private actions:DECActions) {
        this.initGrid();
    }
    private gridOptions: GridOptions;
    private _dataList:any[]=[];
    private selectedIndex:number=0;
    @Input('rprList') set dataList(data:any[]){
        this._dataList=data;
        if(data && data.length){
            if(data.length<=this.selectedIndex){
                this.selectedIndex=data.length-1;
            }
            this.selectedRow=data[this.selectedIndex];
            this.selectedRow.selected=true;
        }
    }
    get dataList(){
        return this._dataList;
    }
    @Output() onLoad = new EventEmitter();
   
    public ngOnInit() {
        this.onLoad.emit(this);
    }
    public isUpdatePending(){
        return this.grid.getUpdatedRecords().length>0 || this._dataList.filter(_=>_.newRecord).length>0;
    }
    public ngOnDestroy() {

    }
    public ngAfterViewInit() {
        this.onLoad.emit(this);
    }
    grid: juGrid;
    protected gridOnLoad(g: juGrid) {
        this.grid = g;
    }
    protected initGrid() {
        this.gridOptions = {
            viewMode: '!panel', noPager: true, pageSize: 20000, height:500, enableCellEditing: true,
            columnDefs: [
                { headerName: 'Short Desc.', field: 'RPR_DSPT_RSN_SHRT_DESCR', width: 120, type:'text'},
                { headerName: 'Auto', field: 'AUTO_DSPT_FLG', width: 100 , type:'checkbox', inputExp:`[disabled]="true"`},
                { headerName: 'Description', field: 'RPR_DSPT_RSN_DESCR', width: 520, type:'text'},
                { headerName: 'HCFA Code', field: 'HCFA_DSPT_RSN_CD', width: 120, type:'juSelect', options:{width:'100%'} },
                { headerName: 'Active', field: 'ACTV_FLG',  width: 100 , type:'checkbox'}
               
            ],
            rowEvents: '(mousedown)="config.rowClick(row,i, $event.ctrlKey)"',
            trClass: row => {
                return { selected: row.selected };
            },
            rowClick: (row: any, index: number, ctrlKey: boolean) => {
                this.selectedRow.selected = false;
                row.selected = true;
                this.selectedRow = row;
               this.selectedIndex=index;
            },
            rowUpdated:()=>{
                this.store.dispatch(this.actions.buttonDeactive({ok:false, delete:false}));
            }
        };
    }
    selectedRow: any = {};
    
    public addRow(){
         this.store.dispatch(this.actions.AddRpr(this.selectedIndex));       
        this.store.dispatch(this.actions.buttonDeactive({ok:false, delete:false}));
    }

    public getUpdatedRecords(){
        return [...this.grid.getUpdatedRecords(), ...this._dataList.filter(_=>_.newRecord)]
    }

    public save(){
        this.store.dispatch(this.actions.saveRpr(this.getUpdatedRecords()));        
    }
    public remove(){
        this.store.dispatch(this.actions.removeRpr(this.selectedRow));
    }

}