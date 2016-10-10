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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const core_1 = require('@angular/core');
const FV_1 = require('../../shared/juForm/FV');
const Rx_1 = require('rxjs/Rx');
const app_service_1 = require('../../shared/app.service');
let CrudExample = class CrudExample {
    constructor(service) {
        this.service = service;
    }
    ngOnInit() {
        this.initScholar();
        Rx_1.Observable.forkJoin(this.service.get('dummyData/getEducations'), this.service.get('dummyData/getAddress/1')).subscribe(res => {
            this.educationList = res[0];
            this.addressList = res[1];
        });
    }
    doSmth() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.service.get('dummyData/getEducations').toPromise();
            console.log(res);
        });
    }
    hideCol() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.service.confirmDialogPromise('Column removing', 'Are you sure to remove the age column?')) {
                this.scholarGridOptions.columnDefs[3].hide = true;
                this.scholarGridOptions.api.grid.render();
            }
            console.log('waiting for user input.');
        });
    }
    onLoad(grid) {
        this.service.get('dummydata/GetScholarList')
            .subscribe(list => {
            this.scholarGridOptions.api.form
                .setData('education', this.educationList)
                .setData('address', this.addressList);
            this.scholarList = list;
        });
    }
    educationCellRender(row) {
        return this.educationList.find(_ => _.value == row.education).text;
    }
    getPagerData() {
        return Rx_1.Observable.of({ totalPage: 1234, data: this.scholarList });
    }
    initScholar() {
        this.scholarGridOptions = {
            title: 'Crud Example', crud: true, pagerPos: 'header',
            columnDefs: [
                { headerName: 'Name', field: 'name', sort: true, filter: 'set' },
                {
                    headerName: 'Education', field: 'education', sort: true, filter: 'set',
                    params: { valueGetter: this.educationCellRender.bind(this) },
                    cellRenderer: this.educationCellRender.bind(this)
                },
                { headerName: 'Age', field: 'age', filter: 'number', sort: true, hide: false },
                { headerName: 'Address', field: 'address', cellRenderer: row => this.addressList.find(_ => _.value == row.address).text },
                { headerName: 'Description', width: 300, field: 'description' }
            ],
            formDefs: {
                title: 'Scholar',
                labelPos: 'left',
                labelSize: 3,
                inputs: [
                    { field: 'name', label: 'Name', type: 'text', validators: [FV_1.FV.required, FV_1.FV.minLength(5)] },
                    { field: 'education', width: 222, label: 'Education', type: 'juSelect', validators: FV_1.FV.required },
                    { field: 'address', label: 'Address', type: 'juSelect', validators: FV_1.FV.required },
                    { field: 'age', label: 'Age', type: 'text', validators: [FV_1.FV.required, FV_1.FV.regex(/^\d+$/, 'Age should be a number')] },
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
    submitScholar(e) {
        this.service.post('dummydata/create_update_scholar', this.scholarGridOptions.api.form.getModel())
            .subscribe(res => {
            console.log(res);
            if (this.scholarGridOptions.api.form.isUpdate) {
                this.scholarGridOptions.api.grid.updateItem(this.scholarGridOptions.api.form.getModel());
            }
            else {
                this.scholarGridOptions.api.grid.addItem(this.scholarGridOptions.api.form.getModel());
            }
            this.scholarGridOptions.api.grid.showMessage('Data updated successfully');
            this.scholarGridOptions.api.form.showModal(false);
        });
    }
};
CrudExample = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'crud',
        template: `
                <div 
                     juGrid                      
                     (onLoad)="onLoad($event)" 
                     [data]="scholarList" 
                     [options]="scholarGridOptions">
                        
                </div>
                <button class="btn btn-primary" (click)="hideCol()">Hide Age Column</button>`,
        encapsulation: core_1.ViewEncapsulation.None
    }), 
    __metadata('design:paramtypes', [app_service_1.AppService])
], CrudExample);
exports.CrudExample = CrudExample;
