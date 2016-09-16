import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {juGrid}       from '../../shared/juGrid/juGrid';
import {GridOptions}  from '../../shared/juGrid/juGrid.d';
import {Observable}   from 'rxjs/Rx';
import {AppService}   from '../../shared/app.service';
@Component({
    moduleId: module.id,
    selector: 'tree',
    template: `
                <div 
                     juGrid 
                     panelMode="primary" 
                     viewMode="panel" 
                     title="Tree View Example" 
                     (onLoad)="onLoad($event)" 
                     [data]="scholarList" 
                     [options]="scholarGridOptions">

                </div>`,

    encapsulation: ViewEncapsulation.None
})

export class TreeExample implements OnInit {
    scholarGridOptions: GridOptions;
    scholarList: any[];
    constructor(private service: AppService) { }
    ngOnInit() {
        this.initScholar();       
    }
    private onLoad(grid: juGrid) {
        this.service.get('dummydata/GetScholarList')
            .subscribe(list => this.scholarList = list);
    }
    private getChildData(row: any) {
        return this.service.get('dummydata/GetScholarList');
    }
    private initScholar() {
        this.scholarGridOptions = {
            //level: 10, default level is 5
            scroll: true,
            colResize: true,
            enableTreeView: true,
            lazyLoad: this.getChildData.bind(this),            
            columnDefs: [
                { headerName: 'Name', sort:true, field: 'name', width: 250 },
                { headerName: 'Education', sort: true, field: 'education' },
                { headerName: 'Age', sort: true, field: 'age'},
                { headerName: 'Address', sort: true, field: 'address' },
                { headerName: 'Description', sort: true, width: 300, field: 'description' },
                { headerName: 'Description', width: 300, field: 'description' },
                { headerName: 'Description', width: 300, field: 'description' },
                { headerName: 'Description', width: 300, field: 'description' },
                { headerName: 'Description', width: 300, field: 'description' },
                { headerName: 'Description', width: 300, field: 'description' }
            ]
        };
    }
    
}