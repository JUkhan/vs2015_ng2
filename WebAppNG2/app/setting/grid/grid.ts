import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {juGrid}       from '../../shared/juGrid/juGrid';
import { FV}          from '../../shared/juForm/FV';
import {GridOptions}  from '../../shared/juGrid/juGrid.d';
import {Observable}   from 'rxjs/Rx';
import {AppService}   from '../../shared/app.service';
@Component({
    moduleId: module.id,
    selector: 'selector',   
    template: '<div juGrid viewMode="panel" title="Test" (onLoad)="onLoad($event)" [data]="scholarList" [options]="scholarGridOptions"></div>',
    styleUrls:['./grid.css'],
    encapsulation:ViewEncapsulation.None
})

export class gridExample implements OnInit {
    scholarGridOptions:GridOptions;
    scholarList: any[];
    constructor(private service: AppService) { }
    ngOnInit() {
        this.initScholar();        
     }
     private onLoad(grid:juGrid){        
        this.service.get('scholar')       
        .subscribe(list=>{this.scholarList=list;});   
        grid.slideToggle();   
     }
    private initScholar() {
        this.scholarGridOptions = { level:10,          
            pageSize:3, quickSearch:true, crud:true, enableCellEditing:false, enableTreeView:false, lazyLoad:this.service.getChildData,                       
            columnDefs: [
                { headerName: 'Name', field: 'name',width:140, sort:true, filter:'set', type:'juSelect'},
                { headerName: 'Education', field: 'education', sort:true, filter:'set'},
                { headerName: 'Age', field: 'age', filter:'number', sort:true},
                { headerName: 'Address', field: 'address'},
                { headerName: 'Description', field: 'description' }
            ],
            formDefs: {
                title: 'Scholar',
                labelPos: 'left',
                labelSize: 3,                
                inputs: [                    
                    { field: 'name', label: 'Name', type: 'text', validators: [FV.required, FV.minLength(5)] },
                    { field: 'education', label: 'Education', type: 'text', validators:FV.required },
                    { field: 'address', label: 'Address', type: 'text', validators:FV.required },
                    { field: 'description', label: 'Description', type: 'textarea' }
                ],
                 buttons: {
                     'Save Change': { type: 'submit', cssClass: 'btn btn-success', click: this.submitScholar.bind(this) },
                     'Close': { type: 'close', cssClass: 'btn btn-default' }
                 }
            },
            removeItem: data => {
                this.service.delete('scholar/' + data.id).subscribe(res => {
                    this.scholarGridOptions.api.grid.showMessage('Data removed successfully');
                    this.scholarGridOptions.api.grid.removeItem(data);                  
                });
            }
        };
    }
    private submitScholar(e:any) {
        if (this.scholarGridOptions.api.form.isUpdate) {
            this.service.put('scholar', this.scholarGridOptions.api.form.getModel())
                .subscribe(res => {
                    this.scholarGridOptions.api.grid.showMessage('Data updated successfully');
                    this.scholarGridOptions.api.form.showModal(false);
                });
        } else {
             this.service.post('scholar', this.scholarGridOptions.api.form.getModel())
                .subscribe(res => {
                    this.scholarGridOptions.api.grid.showMessage('Data inserted successfully');                   
                    this.scholarGridOptions.api.grid.addItem(res);
                    this.scholarGridOptions.api.form.showModal(false);                  
                });
        }

    }    
}