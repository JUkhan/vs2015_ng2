"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const core_1 = require('@angular/core');
const FV_1 = require('../../shared/juForm/FV');
const app_service_1 = require('../../shared/app.service');
let CellEditExample = class CellEditExample {
    constructor(service) {
        this.service = service;
        this.list = [];
        this.counter = 0;
    }
    ngOnInit() {
        this.initGrid();
        this.service.get('dummydata/GetScholarList')
            .subscribe(res => this.list = res);
    }
    saveRecords() {
        console.log(this.gridOptions.api.grid.getUpdatedRecords());
    }
    initGrid() {
        this.gridOptions = {
            viewMode: '!panel',
            quickSearch: true,
            pagerPos: 'bottom',
            colResize: false,
            rowHeight: 50,
            enableCellEditing: true,
            columnDefs: [
                { headerName: '<a href="javascript:;" (click)="config.addItem()" title="New item."><b class="fa fa-plus-circle"></b> </a>', width: 40, cellRenderer: (row, index) => ++index },
                { headerName: 'Name', field: 'name', filter: 'set', sort: true, exp: '<b>{{row.name}}</b>' },
                { headerName: 'Education', field: 'education', filter: 'set', sort: true, change: this.changeEducation.bind(this), validators: FV_1.FV.required, type: 'juSelect', width: 160, options: { width: '100%', title: 'Select education' } },
                { headerName: 'Age', field: 'age', filter: 'number', sort: true, type: 'number', width: 100, validators: FV_1.FV.required },
                { headerName: 'Birth Date', field: 'bdate', type: 'datepicker', width: 160, validators: FV_1.FV.required },
                { headerName: 'Address', field: 'address', type: 'juSelect', width: 170, validators: FV_1.FV.required, options: { width: '100%', title: 'select addresss' } },
                { headerName: 'Description', field: 'description', type: 'text', validators: [FV_1.FV.required, FV_1.FV.minLength(5)], width: 220 }
            ],
            addItem: () => {
                this.counter++;
                this.gridOptions.api.grid.addItem({ name: 'Abdulla' + this.counter });
            }
        };
    }
    gridLoad(grid) {
        this.service.get('dummyData/getEducations')
            .subscribe(res => grid.setSelectData('education', res));
    }
    changeEducation(obj) {
        this.service.get('dummyData/getAddress/' + obj.value)
            .subscribe(res => this.gridOptions.api.grid.setJuSelectData('address', res, obj.index));
    }
};
CellEditExample = __decorate([
    core_1.Component({
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
            `
    }), 
    __metadata('design:paramtypes', [app_service_1.AppService])
], CellEditExample);
exports.CellEditExample = CellEditExample;

//# sourceMappingURL=cellEditExample.js.map
