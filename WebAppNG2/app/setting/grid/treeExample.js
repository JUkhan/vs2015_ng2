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
const app_service_1 = require('../../shared/app.service');
let TreeExample = class TreeExample {
    constructor(service) {
        this.service = service;
    }
    ngOnInit() {
        this.initScholar();
    }
    onLoad(grid) {
        this.service.get('dummydata/GetScholarList')
            .subscribe(list => this.scholarList = list);
    }
    getChildData(row) {
        return this.service.get('dummydata/GetScholarList');
    }
    initScholar() {
        this.scholarGridOptions = {
            title: 'Tree view Example',
            colResize: true,
            enableTreeView: true,
            lazyLoad: this.getChildData.bind(this),
            columnDefs: [
                { headerName: 'Name', sort: true, field: 'name', width: 250 },
                { headerName: 'Education', sort: true, field: 'education' },
                { headerName: 'Age', sort: true, field: 'age' },
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
};
TreeExample = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'tree',
        template: ` 
                <div 
                     juGrid                     
                     (onLoad)="onLoad($event)" 
                     [data]="scholarList" 
                     [options]="scholarGridOptions">

                </div>`,
        encapsulation: core_1.ViewEncapsulation.None
    }), 
    __metadata('design:paramtypes', [app_service_1.AppService])
], TreeExample);
exports.TreeExample = TreeExample;

//# sourceMappingURL=treeExample.js.map
