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
var CrudExample = (function () {
    function CrudExample(service) {
        this.service = service;
    }
    CrudExample.prototype.ngOnInit = function () {
        var _this = this;
        this.initScholar();
        Rx_1.Observable.forkJoin(this.service.get('dummyData/getEducations'), this.service.get('dummyData/getAddress/1')).subscribe(function (res) {
            _this.educationList = res[0];
            _this.addressList = res[1];
        });
    };
    CrudExample.prototype.doSmth = function () {
        alert('assddd');
    };
    CrudExample.prototype.onLoad = function (grid) {
        var _this = this;
        this.service.get('dummydata/GetScholarList')
            .subscribe(function (list) {
            _this.scholarGridOptions.api.form
                .setData('education', _this.educationList)
                .setData('address', _this.addressList);
            _this.scholarList = list;
        });
    };
    CrudExample.prototype.educationCellRender = function (row) {
        return this.educationList.find(function (_) { return _.value == row.education; }).text;
    };
    CrudExample.prototype.getPagerData = function () {
        return Rx_1.Observable.of({ totalPage: 1234, data: this.scholarList });
    };
    CrudExample.prototype.initScholar = function () {
        var _this = this;
        this.scholarGridOptions = {
            title: 'Crud Example', crud: true, pagerPos: 'header',
            columnDefs: [
                { headerName: 'Name', field: 'name', sort: true, filter: 'set' },
                {
                    headerName: 'Education', field: 'education', sort: true, filter: 'set',
                    params: { valueGetter: this.educationCellRender.bind(this) },
                    cellRenderer: this.educationCellRender.bind(this)
                },
                { headerName: 'Age', field: 'age', filter: 'number', sort: true, hide: true },
                { headerName: 'Address', field: 'address', cellRenderer: function (row) { return _this.addressList.find(function (_) { return _.value == row.address; }).text; } },
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
            removeItem: function (data) {
                _this.service.get('dummydata/remove_scholar/' + data.id).subscribe(function (res) {
                    _this.scholarGridOptions.api.grid.showMessage('Data removed successfully');
                    _this.scholarGridOptions.api.grid.removeItem(data);
                });
            }
        };
    };
    CrudExample.prototype.submitScholar = function (e) {
        var _this = this;
        this.service.post('dummydata/create_update_scholar', this.scholarGridOptions.api.form.getModel())
            .subscribe(function (res) {
            console.log(res);
            if (_this.scholarGridOptions.api.form.isUpdate) {
                _this.scholarGridOptions.api.grid.updateItem(_this.scholarGridOptions.api.form.getModel());
            }
            else {
                _this.scholarGridOptions.api.grid.addItem(_this.scholarGridOptions.api.form.getModel());
            }
            _this.scholarGridOptions.api.grid.showMessage('Data updated successfully');
            _this.scholarGridOptions.api.form.showModal(false);
        });
    };
    CrudExample = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'crud',
            template: "\n                <div \n                     juGrid                      \n                     (onLoad)=\"onLoad($event)\" \n                     [data]=\"scholarList\" \n                     [options]=\"scholarGridOptions\">\n                        \n                </div>",
            encapsulation: core_1.ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [app_service_1.AppService])
    ], CrudExample);
    return CrudExample;
}());
exports.CrudExample = CrudExample;
//# sourceMappingURL=crudExample.js.map