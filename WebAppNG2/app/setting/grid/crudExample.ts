import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {juGrid, GridOptions}       from '../../shared/juGrid/juGrid';
import { FV}          from '../../shared/juForm/FV';
import {Observable}   from 'rxjs/Rx';
import {AppService}   from '../../shared/app.service';
@Component({
    moduleId: module.id,
    selector: 'crud',
    template: `
                <div 
                     juGrid                      
                     (onLoad)="onLoad($event)" 
                     [data]="scholarList" 
                     [options]="scholarGridOptions">
                        
                </div>`,

    encapsulation: ViewEncapsulation.None
})

export class CrudExample implements OnInit {
    scholarGridOptions: GridOptions;
    scholarList: any[];
    educationList: any[];
    addressList: any[];
    constructor(private service: AppService) { }
    ngOnInit() {
        this.initScholar();
        Observable.forkJoin(
            this.service.get('dummyData/getEducations'),
            this.service.get('dummyData/getAddress/1')
        ).subscribe(res => {          
            this.educationList = res[0];
            this.addressList = res[1]
        });

    }
    doSmth(){
    alert('assddd')
    }
    private onLoad(grid: juGrid)
    {         
        this.service.get('dummydata/GetScholarList')
            .subscribe(list => {
                this.scholarGridOptions.api.form
                    .setData('education', this.educationList)
                    .setData('address', this.addressList);
                this.scholarList = list
            });
    }
    educationCellRender(row) {
        return this.educationList.find(_ => _.value == row.education).name;
    }
    private getPagerData()
    {
        return Observable.of({ totalPage: 1234, data: this.scholarList})
    }
    private initScholar() {
        this.scholarGridOptions = {
            title:'Crud Example', crud: true, pagerPos:'header',
            //sspFn: this.getPagerData.bind(this),
            columnDefs: [
                { headerName: 'Name', field: 'name', sort: true, filter: 'set' },
                {
                    headerName: 'Education', field: 'education', sort: true, filter: 'set',
                    params: { valueGetter: this.educationCellRender.bind(this) },
                    cellRenderer: this.educationCellRender.bind(this)
                },
                { headerName: 'Age', field: 'age', filter: 'number', sort: true },
                { headerName: 'Address', field: 'address', cellRenderer: row => this.addressList.find(_ => _.value == row.address).name },
                { headerName: 'Description', width: 300, field: 'description' }
            ],
            formDefs: {
                title: 'Scholar',
                labelPos: 'left',
                labelSize: 3,
                inputs: [
                    { field: 'name', label: 'Name', type: 'text', validators: [FV.required, FV.minLength(5)] },
                    { field: 'education', width: 222, label: 'Education', type: 'juSelect', validators: FV.required },
                    { field: 'address', label: 'Address', type: 'juSelect', validators: FV.required },
                    { field: 'age', label: 'Age', type: 'text', validators: [FV.required, FV.regex(/^\d+$/, 'Age should be a number')] },
                    { field: 'description', label: 'Description', type: 'textarea' }
                ],
                buttons: {
                    'Save Change': { type: 'submit', cssClass: 'btn btn-success', click: this.submitScholar.bind(this) },
                    'Close': { type: 'close', cssClass: 'btn btn-default' }
                }
            },
            removeItem: data => {
                this.service.get('dummydata/remove_scholar/' + data.id).subscribe(res => {
                    this.scholarGridOptions.api.grid.showMessage('Data removed successfully');
                    this.scholarGridOptions.api.grid.removeItem(data);
                });
            }
        };
    }
    private submitScholar(e: any) {
        this.service.post('dummydata/create_update_scholar', this.scholarGridOptions.api.form.getModel())
            .subscribe(res => {
                if (this.scholarGridOptions.api.form.isUpdate) {
                    this.scholarGridOptions.api.grid.updateItem(this.scholarGridOptions.api.form.getModel());
                } else {
                    this.scholarGridOptions.api.grid.addItem(this.scholarGridOptions.api.form.getModel());
                }
                this.scholarGridOptions.api.grid.showMessage('Data updated successfully');
                this.scholarGridOptions.api.form.showModal(false);
            });

    }
}