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
var app_service_1 = require('../../shared/app.service');
var CellEditExample = (function () {
    function CellEditExample(service) {
        this.service = service;
        this.list = [];
        this.counter = 0;
    }
    CellEditExample.prototype.ngOnInit = function () {
        var _this = this;
        this.initGrid();
        this.service.get('dummydata/GetScholarList')
            .subscribe(function (res) { return _this.list = res; });
    };
    CellEditExample.prototype.loadData = function (params) {
        return this.service.getUploadData('scolar');
    };
    CellEditExample.prototype.saveRecords = function () {
        console.log(this.gridOptions.api.grid.getUpdatedRecords());
    };
    CellEditExample.prototype.initGrid = function () {
        var _this = this;
        this.gridOptions = {
            quickSearch: true,
            pagerPos: 'bottom',
            colResize: true,
            rowHeight: 50,
            enableCellEditing: true,
            columnDefs: [
                { headerName: '<a href="javascript:;" (click)="config.addItem()" title="New item"><b class="fa fa-plus-circle"></b> </a>', width: 30, cellRenderer: function (row, index) { return ++index; } },
                { headerName: 'Name', field: 'name', filter: 'set', sort: true },
                { headerName: 'Education', field: 'education', filter: 'set', sort: true, change: this.changeEducation.bind(this), validators: FV_1.FV.required, type: 'juSelect', width: 160 },
                { headerName: 'Age', field: 'age', filter: 'number', sort: true, type: 'number', width: 100, validators: FV_1.FV.required },
                { headerName: 'Birth Date', field: 'bdate', type: 'datepicker', width: 160, validators: FV_1.FV.required },
                { headerName: 'Address', field: 'address', viewMode: 'select', search: true, type: 'juSelect', width: 170, validators: FV_1.FV.required },
                { headerName: 'Description', field: 'description', type: 'text', validators: [FV_1.FV.required, FV_1.FV.minLength(5)], width: 220 }
            ],
            addItem: function () {
                _this.counter++;
                _this.gridOptions.api.grid.addItem({ name: 'Abdulla' + _this.counter });
            }
        };
    };
    CellEditExample.prototype.gridLoad = function (grid) {
        this.service.get('dummyData/getEducations')
            .subscribe(function (res) { return grid.setDropdownData('education', res); });
    };
    CellEditExample.prototype.changeEducation = function (obj) {
        var _this = this;
        this.service.get('dummyData/getAddress/' + obj.value)
            .subscribe(function (res) { return _this.gridOptions.api.grid.setJuSelectData('address', res, obj.index); });
    };
    CellEditExample = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'cellEdit',
            template: "\n            <div \n                  class=\"juGrid\" \n                  title=\"Grid Cell Editable Example\"                  \n                  (onLoad)=\"gridLoad($event)\" \n                  [data]=\"list\" \n                  [options]=\"gridOptions\">\n\n             </div>\n            <button type=\"button\" class=\"btn btn-primary\" (click)=\"saveRecords()\">Save Records</button>\n            "
        }), 
        __metadata('design:paramtypes', [app_service_1.AppService])
    ], CellEditExample);
    return CellEditExample;
}());
exports.CellEditExample = CellEditExample;
//# sourceMappingURL=cellEditExample.js.map