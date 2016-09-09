import {Component, OnInit}        from '@angular/core';

import {juGrid}                   from '../../shared/juGrid/juGrid';
import { FV}                      from '../../shared/juForm/FV';
import {FormOptions, FormElement} from '../../shared/juForm/juForm.d';
import {GridOptions}              from '../../shared/juGrid/juGrid.d';
import {Observable}               from 'rxjs/Rx';
import {AppService}               from '../../shared/app.service';

@Component({
    moduleId:module.id,
    templateUrl: './upload.html',
    styleUrls: ['./upload.css']
})

export class UploadComponent implements OnInit {
    private list: any[] = [];
    private formOptions: FormOptions;
    private gridOptions: GridOptions;

    constructor(private service: AppService) { }

    ngOnInit() {
        this.initForm();
        this.initGrid();
    }
    private loadData(params: any) {
        console.log(params);
        return this.service.getUploadData('scolar');
    }
    private initForm() {
        this.formOptions = {
            labelPos: 'left',
            inputs: [
                [<FormElement>{ field: 'file1', type: 'file', size: 6, label: 'Test File', validators:FV.required },
                    <FormElement>{ type: 'html', content: `<button class="btn btn-success" [disabled]="!config.api.valid" (click)="config.upload()">Import</button>` }
                ]
            ],
            upload: () => {                
                this.gridOptions.api.pager.firePageChange();
                console.log(this.gridOptions.api.grid.getUpdatedRecords());
            }
        }
    }

    private initGrid() {
        this.gridOptions = {
            pageSize: 5, crud: false, quickSearch: false, enableCellEditing: true, rowHeight: 60,
            //sspFn: this.loadData.bind(this),
            columnDefs: [
                { headerName: '<a href="javascript:;" (click)="config.addItem()" title="New item"><b class="fa fa-plus-circle"></b> </a>', width:30, cellRenderer: (row, index) => ++index },
                { headerName: 'Name', filter:'set', sort: true, field: 'name' },
                { headerName: 'Education', filter:'set', sort:true, change:this.changeEducation.bind(this), validators:FV.required, field: 'education',type:'select', width:160},
                { headerName: 'Age', filter:'number', sort:true, field: 'age', type:'number', width:100, validators:FV.required},
                { headerName: 'Birth Date', field: 'bdate', type:'datepicker', width:160, validators:FV.required},
                { headerName: 'Address', viewMode:'checkbox', search:true,  field: 'address', type:'select', width:150, validators:FV.required },
                { headerName: 'Description', field: 'description', type:'text', validators:[FV.required, FV.minLength(5)] , width:220}
            ],
            addItem:()=>{
                // this.service.getUploadData('scolar').subscribe(res=>{
                //     console.log(res);
                //     this.list=res.data;
                // });
                this.counter++;
                this.gridOptions.api.grid.addItem({name:'Abdulla'+this.counter});
            }
        }
    }
    counter=0
    private routerCanDeactivate(nextInstruction, prevInstruction) { 
        return false;
        
    }
    private gridLoad(grid:juGrid){
        grid.setDropdownData('education',this.service.getEducations2());
    }
    private changeEducation(obj){
        let data=[{name:'Tangail', value:'Tangail'},{name:'Dhaka', value:'Dhaka'}];
        this.gridOptions.api.grid.setJuSelectData('address', data, obj.index);
    }
}