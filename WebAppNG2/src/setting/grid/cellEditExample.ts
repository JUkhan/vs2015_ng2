import {Component, OnInit}        from '@angular/core';
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
    constructor(private service: AppService, private store: Store) {
        this.houseWorked = store.select('houseWorked');
      
    }
    onHouseWorked() {
        this.store.dispatch({ type: 'ADD_HOUR' });
    }
    ngOnInit() {
        this.initGrid();
        this.service.get('dummydata/GetScholarList')
            .subscribe(res => this.list = res);
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
                { headerName: 'Name', field: 'name', filter: 'set', sort: !true, exp:'<div class="cell"><b>{{row.name}}</b></div>'},
                { headerName: 'Education', field: 'education', filter: 'set', sort: !true, change: this.changeEducation.bind(this), validators: FV.required, type: 'juSelect', width: 160, options:<SelectOptions>{width:'100%', fixedPosition:true, title:'Select education'} },
                { headerName: 'Age', field: 'age', filter: 'number', sort: !true, type: 'number', width: 100, validators:[ FV.required, FV.validate(val=>parseInt(val)>20,'Age should be abobe 25') ]},
                { headerName: 'Birth Date', field: 'bdate', type: 'datepicker', width: 160, validators: FV.required },
                { headerName: 'Address', field: 'address', type: 'juSelect', width: 170, validators: FV.required , options:{width:'100%', fixedPosition:true, title:'select addresss'}},
                { headerName: 'Description', field: 'description', type: 'text', validators: [FV.required, FV.minLength(5)], width: 220 }
            ],
            addItem: () => {
                this.counter++;
                this.gridOptions.api.grid.addItem({ name: 'Abdulla' + this.counter });
            }
        }
    }
    counter = 0
    private gridLoad(grid: juGrid) {
        this.service.get('dummyData/getEducations')
            .subscribe(res => grid.setSelectData('education', res));
        
    }
    private changeEducation(obj)
    {  
          this.service.get('dummyData/getAddress/' + obj.value)            
            .subscribe(res => this.gridOptions.api.grid.setJuSelectData('address', res, obj.index));      
    }
}