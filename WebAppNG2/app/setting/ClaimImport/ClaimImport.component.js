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
var ClaimImport = (function () {
    function ClaimImport(service) {
        this.service = service;
        this.activeProgram = 0;
        this.fileName = '';
    }
    ClaimImport.prototype.ngOnInit = function () {
        this.initForm();
        this.initGrid();
        this.initSaveForm();
    };
    ClaimImport.prototype.loadData = function (params) {
        var _this = this;
        if (!this.fileName) {
            return Rx_1.Observable.of({ data: null });
        }
        params.fileName = this.fileName;
        return this.service.get(this.service.getUrl('Utilization/GetFormattedClaimData', params))
            .do(function (res) {
            var records = _this.gridOptions.api.grid.getUpdatedRecords();
            if (records.length) {
                _this.service.post('Utilization/UpdateClaimRecords', { dataList: records, fileName: _this.fileName }).subscribe();
            }
        });
    };
    ClaimImport.prototype.initForm = function () {
        var _this = this;
        this.formOptions = {
            labelPos: 'left', refreshBy: { program: 0 },
            inputs: [
                {
                    type: 'groupLayout', items: [
                        {
                            groupName: 'File Location', labelSize: 2, inputs: [
                                [{ field: 'file1', type: 'file', size: 5, label: 'File', validators: FV_1.FV.required },
                                    { type: 'html', content: "<div class=\"col-md-1\"><button class=\"btn btn-success\" [disabled]=\"!config.api.valid\" (click)=\"config.upload()\">Import</button></div>" },
                                    {
                                        type: 'html', content: "\n          <div class=\"col-md-3\">\n            <button type=\"button\" class=\"btn btn-default\">View File</button> &nbsp;\n            <button type=\"button\" class=\"btn btn-default\">Reset</button> \n          </div>" }
                                ]
                            ]
                        }
                    ]
                },
                {
                    type: 'groupLayout', items: [
                        [{
                                groupName: 'CMS format', labelSize: 4, size: 4, inputs: [
                                    [{ field: 'program', size: 8, label: 'Program', type: 'select' },
                                        { type: 'html', content: "<button type=\"button\" [disabled]=\"model.program.toString()==='0'\" (click)=\"config.updateAll()\" class=\"btn btn-default\">Update All</button>" }]
                                ]
                            },
                            {
                                groupName: 'State format', size: 2, inputs: [
                                    { type: 'html', content: "<div style=\"text-align:center;padding-bottom:20px;\"><label><input type=\"checkbox\"> CA</label></div>" }
                                ]
                            },
                            {
                                groupName: '', labelPos: 'top', size: 6, isContainer: true, inputs: [
                                    [
                                        { field: 'invoiceNo', size: 4, label: 'Invoice Number', type: 'text' },
                                        { field: 'postmarkDate', size: 4, label: 'Postmark Date', type: 'datepicker' },
                                        { field: 'receivedDate', size: 4, label: 'Received Date', type: 'datepicker' }
                                    ]
                                ]
                            }]
                    ]
                }
            ],
            upload: function () {
                _this.service.upload('Utilization/ImportClaimDataFile', _this.formOptions.api.getModel()).subscribe(function (res) {
                    if (!res.error)
                        _this.fileName = res.msg;
                    _this.gridOptions.api.pager.firePageChange();
                });
            },
            updateAll: function () {
                _this.activeProgram = _this.formOptions.api.getModel().program;
                _this.service.get(_this.service.getUrl('Utilization/UpdateClaimProgramId', { programId: _this.activeProgram, fileName: _this.fileName }))
                    .subscribe(function (res) {
                    _this.gridOptions.api.pager.firePageChange();
                });
            }
        };
    };
    ClaimImport.prototype.initGrid = function () {
        var _this = this;
        this.gridOptions = {
            pageSize: 10, linkPages: 20, crud: false, quickSearch: false, enableCellEditing: true,
            sspFn: this.loadData.bind(this), headerHeight: 60,
            columnDefs: [
                { headerName: 'Status', field: 'status', sort: true },
                { headerName: 'Line', field: 'line', sort: true },
                { headerName: 'PgmId', field: 'pgmId', sort: true, width: 120, type: 'select' },
                { headerName: 'State Cd', field: 'stateCd', type: 'text', sort: true },
                { headerName: 'NDC11', field: 'ndc11', sort: true, type: 'text', width: 120 },
                { headerName: 'Period CoveredQYYYY', field: 'periodCoveredQYYYY', sort: true, type: 'number' },
                { headerName: 'Unit Rebate Amount', field: 'unitRebateAmount', sort: true, cellRenderer: function (row) { return _this.formatData(row.unitRebateAmount, 1000000); } },
                { headerName: 'Unit Reimbursed', field: 'unitReimbursed', sort: true, cellRenderer: function (row) { return _this.formatData(row.unitReimbursed, 1000); } },
                { headerName: 'Rebate Claimed Amount', width: 200, field: 'rebateClaimedAmount', sort: true, cellRenderer: function (row) { return '$' + _this.formatData(row.rebateClaimedAmount, 100); } },
                { headerName: 'Script Cnt', field: 'scriptCnt', sort: true },
                { headerName: 'Medicaid Reimb Amount', field: 'medicaidReimbAmount', sort: true, cellRenderer: function (row) { return '$' + _this.formatData(row.medicaidReimbAmount, 100); } },
                { headerName: 'NonMedicaid Reimb Amount', field: 'nonMedicaidReimbAmount', sort: true, cellRenderer: function (row) { return '$' + _this.formatData(row.nonMedicaidReimbAmount, 100); } },
                { headerName: 'Total Reimb Amount', field: 'totalReimbAmount', sort: true, cellRenderer: function (row) { return '$' + _this.formatData(row.totalReimbAmount, 100); } },
                { headerName: 'Corr Flag', field: 'corrFlag', sort: true },
                { headerName: 'Error Description', field: 'errorDescription', sort: true }
            ]
        };
    };
    ClaimImport.prototype.formatData = function (val, divBy) {
        return val.toString().indexOf('.') >= 0 ? val : val / divBy;
    };
    ClaimImport.prototype.onLoadFilter = function (form) {
        var _this = this;
        this.service.get('Utilization/GetProgramData').
            subscribe(function (res) {
            form.setData('program', res.data);
            _this.gridOptions.api.grid.setDropdownData('pgmId', res.data);
        });
    };
    ClaimImport.prototype.initSaveForm = function () {
        var _this = this;
        this.saveFormOptions = {
            labelPos: 'left', refreshBy: {},
            inputs: [
                {
                    type: 'groupLayout', items: [
                        [{
                                groupName: 'Validation', size: 3, inputs: [
                                    {
                                        type: 'html', content: "\n                    <label><input type=\"radio\" name=\"validation\"> Schedule now &nbsp;</label>\n                    <label><input type=\"radio\" name=\"validation\"> Delay until 6pm &nbsp;</label>\n                    <label><input type=\"radio\" name=\"validation\"> Do not schedule</label>\n                  " }]
                            },
                            {
                                groupName: '', labelPos: 'top', size: 6, isContainer: true, inputs: [
                                    [
                                        {
                                            type: 'html', content: "<div style=\"padding:30px;\">\n                    <button type=\"button\" class=\"btn btn-default\">Error Check</button>&nbsp;\n                    <button type=\"button\" class=\"btn btn-default\">Delete</button> <b style=\"width:50px;display:inline-block\"></b>\n                    <button type=\"button\" (click)=\"config.save()\" class=\"btn btn-default\">Save</button>&nbsp;\n                    <button type=\"button\" class=\"btn btn-default\">Close</button>\n                    </div>\n                    " }
                                    ]
                                ]
                            }]
                    ]
                }
            ],
            save: function () {
                _this.saveFormOptions.api.showMessage('Saved successfully');
                _this.service.showMessage('Saved successfully');
            }
        };
    };
    ClaimImport = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: './ClaimImport.html',
            styleUrls: ['./ClaimImport.css']
        }), 
        __metadata('design:paramtypes', [app_service_1.AppService])
    ], ClaimImport);
    return ClaimImport;
}());
exports.ClaimImport = ClaimImport;
//# sourceMappingURL=ClaimImport.component.js.map