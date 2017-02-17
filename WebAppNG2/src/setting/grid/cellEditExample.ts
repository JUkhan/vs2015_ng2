import {Component, OnInit, Renderer}        from '@angular/core';
import {juGrid, GridOptions}                   from '../../shared/juGrid/juGrid';
import { FV}                      from '../../shared/juForm/FV';
import {Observable}               from 'rxjs/Rx';
import {AppService}               from '../../shared/app.service';
import { SelectOptions}                      from '../../shared/juForm/JuSelect';
import {Store, storeFactory} from '../../Store';
import {houseWorked} from './houseWorked';
@Component({
    moduleId: module.id,
    selector: 'cellEdit',
    template: `
            <div  
                  class="juGrid"                                   
                  (onLoad)="gridLoad($event)" 
                  [data]="list" 
                  [options]="gridOptions">
                   <template><button class="btn btn-primary" (click)="saveRecords()">Save Records</button></template>
            </div> 
              <div>houseWorked: {{houseWorked | async}} <button (click)="onHouseWorked()">Click++</button></div>        
            `,
    providers: [storeFactory({ houseWorked})]
})

export class CellEditExample implements OnInit {
    private list: any[] = [];
    private gridOptions: GridOptions;
    houseWorked: any;
    constructor(private service: AppService, private store: Store, private renderer: Renderer) {
        this.houseWorked = store.select('houseWorked');
      
    }
    onHouseWorked() {
        this.store.dispatch({ type: 'ADD_HOUR' });
    }
    keydownListener: any;
    ngOnInit() {
        this.initGrid();
        this.service.get('dummydata/GetScholarList')
            .subscribe(res => {
                res[0].selected = true;
                this.selectedRow = res[0];
                this.list = res;
            });
       
    }
    ngAfterViewInit() {
        this.keydownListener = this.renderer.listenGlobal('window', 'keydown', e => {         
            var keyupdown = false;
            if (e.key === 'ArrowUp') { this.rowIndex--;  keyupdown = true;}
            if (e.key === 'ArrowDown') { this.rowIndex++; keyupdown = true;}
            if (this.rowIndex < 0 || this.rowIndex >= this.list.length) this.rowIndex = 0;
            if (keyupdown) {
                e.preventDefault();
                this.rowClick(this.list[this.rowIndex], this.rowIndex);
            }
        });
    }
    ngOnDestroy() {
        this.keydownListener && this.keydownListener();
    }
    private saveRecords() {
        console.log(this.gridOptions.api.grid.getUpdatedRecords());
        console.log(this.gridOptions.api.grid.getValidRows()); 
    }

    private initGrid() {
        this.gridOptions = {           
            viewMode:'!panel',
            quickSearch: true,
            pagerPos: 'bottom',
            colResize: !false,
            headerHeight:40,
            rowHeight: 39, 
            enableCellEditing: true,
            columnDefs: [
                { headerName: '<a href="javascript:;" (click)="config.addItem()" title="New item."><b class="fa fa-plus-circle"></b> </a>', width: 40, cellRenderer: (row, index) => `<div class="cell">${++index}</div>`  },
                { editPermission: row => row.selected, headerName: 'Name', field: 'name', filter: 'set', sort: !true, exp:'<div class="cell"><b>{{row.name}}</b></div>'},
                { editPermission: row => row.selected, headerName: 'Education', field: 'education', filter: 'set', sort: !true, change: this.changeEducation.bind(this), validators: FV.required, type: 'juSelect', width: 160, options: <SelectOptions>{ width: '100%', title: 'Select education' }, getValue: row => { const ed = this.educations.find(_ => _.value === row.education); return ed && ed.text; } },
                { editPermission: row => row.selected, pipe:'percent', headerName: 'Age', field: 'age', filter: 'number', sort: !true, type: 'number', width: 100, validators: [FV.required, FV.validate(val => parseInt(val) > 20, 'Age should be abobe 25')] },
                { editPermission: row => row.selected, headerName: 'Birth Date', field: 'bdate', type: 'datepicker', width: 160, validators: FV.required, inputExp: `[disabled]="row.age>25"`, config: { format: 'dd/mm/yyyy', autoclose: true, startView: 2, minView: 2 }},
                { editPermission: row => row.selected, headerName: 'Address', field: 'address', type: 'juSelect', width: 170, validators: FV.required , options:{width:'100%', title:'select addresss'}},
                { editPermission: row => row.selected, headerName: 'Description', field: 'description', type: 'text', validators: [FV.required, FV.minLength(5)], width: 220 }
            ],
            addItem: () => {
                this.counter++;
                this.gridOptions.api.grid.addItem({ name: 'Abdulla' + this.counter });
            },            
            rowEvents: `(click)="config.rowClick(row)"`,
            rowClick: this.rowClick.bind(this),
            trClass: row => ({selected:row.selected})
        }
    }
    private rowClick(row, index) {
        this.selectedRow.selected = false;
        row.selected = true;
        this.selectedRow = row;
       setTimeout(()=> this.grid.focus('age', index),300);
    }
    rowIndex: number = 0;
    selectedRow: any = {};
    counter = 0;
    educations: any[]=[];
    grid:juGrid;
    private gridLoad(grid: juGrid) {
    this.grid=grid;
        this.service.get('dummyData/getEducations')
            .subscribe(res => { this.educations = res; grid.setSelectData('education', res) });
        
    }
    private changeEducation(obj)
    {  
          this.service.get('dummyData/getAddress/' + obj.value)            
            .subscribe(res => this.gridOptions.api.grid.setJuSelectData('address', res, obj.index));      
    }
}