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
var core_1 = require('@angular/core');
var FV_1 = require('../../shared/juForm/FV');
var Rx_1 = require('rxjs/Rx');
var app_service_1 = require('../../shared/app.service');
var gridExample = (function () {
    function gridExample(service) {
        this.service = service;
    }
    gridExample.prototype.ngOnInit = function () {
        this.initScholar();
    };
    gridExample.prototype.onLoad = function (grid) {
        var _this = this;
        this.service.get_d('scholar')
            .subscribe(function (list) { _this.scholarList = list; });
    };
    gridExample.prototype.getSSPFN = function (params) {
        return Rx_1.Observable.of({ totalPage: 150, data: this.scholarList });
    };
    gridExample.prototype.initScholar = function () {
        var _this = this;
        this.scholarGridOptions = { level: 10,
            pageSize: 3, quickSearch: true, crud: true, enableCellEditing: false, enableTreeView: false, lazyLoad: this.service.getChildData,
            rowEvents: '(click)="config.rowClick(row, i)"', pagerPos: 'header',
            sspFn: this.getSSPFN.bind(this),
            columnDefs: [
                { headerName: 'Name', field: 'name', width: 120, sort: true, filter: 'set', type: 'juSelect' },
                { headerName: 'Education', width: 300, field: 'education', sort: true, filter: 'set' },
                { headerName: 'Age', field: 'age', filter: 'number', sort: true },
                { headerName: 'Address', field: 'address' },
                { headerName: 'Description', field: 'description' }
            ],
            formDefs: {
                title: 'Scholar',
                labelPos: 'left',
                labelSize: 3,
                inputs: [
                    { field: 'name', label: 'Name', type: 'text', validators: [FV_1.FV.required, FV_1.FV.minLength(5)] },
                    { field: 'education', label: 'Education', type: 'text', validators: FV_1.FV.required },
                    { field: 'address', label: 'Address', type: 'text', validators: FV_1.FV.required },
                    { field: 'description', label: 'Description', type: 'textarea' }
                ],
                buttons: {
                    'Save Change': { type: 'submit', cssClass: 'btn btn-success', click: this.submitScholar.bind(this) },
                    'Close': { type: 'close', cssClass: 'btn btn-default' }
                }
            },
            removeItem: function (data) {
                _this.service.delete_d('scholar/' + data.id).subscribe(function (res) {
                    _this.scholarGridOptions.api.grid.showMessage('Data removed successfully');
                    _this.scholarGridOptions.api.grid.removeItem(data);
                });
            },
            rowClick: function (row, index) { row.address = row.address + '.....'; }
        };
    };
    gridExample.prototype.submitScholar = function (e) {
        var _this = this;
        if (this.scholarGridOptions.api.form.isUpdate) {
            this.service.put_d('scholar', this.scholarGridOptions.api.form.getModel())
                .subscribe(function (res) {
                _this.scholarGridOptions.api.grid.showMessage('Data updated successfully');
                _this.scholarGridOptions.api.grid.updateItem(_this.scholarGridOptions.api.form.getModel());
                _this.scholarGridOptions.api.form.showModal(false);
            });
        }
        else {
            this.service.post_d('scholar', this.scholarGridOptions.api.form.getModel())
                .subscribe(function (res) {
                _this.scholarGridOptions.api.grid.showMessage('Data inserted successfully');
                _this.scholarGridOptions.api.grid.addItem(res);
                _this.scholarGridOptions.api.form.showModal(false);
            });
        }
    };
    gridExample = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'selector',
            template: '<div juGrid panelMode="primary" viewMode="panel" title="Test" (onLoad)="onLoad($event)" [data]="scholarList" [options]="scholarGridOptions"></div>',
            styleUrls: ['./grid.css'],
            encapsulation: core_1.ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [app_service_1.AppService])
    ], gridExample);
    return gridExample;
}());
exports.gridExample = gridExample;
//# sourceMappingURL=grid.js.map